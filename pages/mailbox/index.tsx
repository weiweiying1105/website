import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMailDetailStore, useMailListStore, useNewMailStore, useUtilsStore } from 'lib/zustand-store';
import { userHttp, mailHttp } from 'lib/http';
import { MMHttp, PostfixOfAddress } from 'lib/base';
import { IPersonItem, MetaMailTypeEn, MarkTypeEn, MailBoxTypeEn, ReadStatusTypeEn } from 'lib/constants';
import { userSessionStorage, userLocalStorage, mailLocalStorage } from 'lib/utils';
import { createEncryptedMailKey, getPrivateKey, decryptMailKey } from 'lib/encrypt';
import MailBoxContext from 'context/mail';
import Layout from 'components/Layout';
import MailList from 'components/MailList';
import MailDetail from 'components/MailDetail';
import NewMail from 'components/NewMail';
import Loading from 'components/Loading';

export default function MailBoxPage() {
  const router = useRouter();
  const { selectedMail } = useMailDetailStore();
  const { setUnreadCount, setSpamCount } = useMailListStore();
  const { selectedDraft, setSelectedDraft } = useNewMailStore();
  const { removeAllState } = useUtilsStore();
  const [showLoading, setShowLoading] = useState(false);

  const logout = () => {
    userLocalStorage.clearAll();
    mailLocalStorage.clearAll();
    userSessionStorage.clearAll();
    removeAllState();
    router.push('/');
  };

  const checkEncryptable = async (receivers: IPersonItem[]) => {
    const getSinglePublicKey = async (receiver: IPersonItem) => {
      try {
        const encryptionData = await userHttp.getEncryptionKey(receiver.address.split('@')[0]);
        return encryptionData.public_key;
      } catch (error) {
        console.error('Failed to get public key of receiver: ', receiver.address);
        console.error(error);
        return '';
      }
    };
    const publicKeys = await Promise.all(receivers.map(receiver => getSinglePublicKey(receiver)));
    return {
      encryptable: receivers.length && publicKeys.every(key => key?.length),
      publicKeys,
    };
  };

  const createDraft = async (mailTo: IPersonItem[]) => {
    const { address, ensName } = userLocalStorage.getUserInfo();
    const mailFrom = {
      address: (ensName || address) + PostfixOfAddress,
      name: ensName || address,
    };
    setSelectedDraft({
      mail_from: mailFrom,
      mail_to: mailTo,
      mail_cc: [],
      mark: MarkTypeEn.Normal,
      part_html: '',
      part_text: '',
      attachments: [],
      subject: '',
      meta_type: MetaMailTypeEn.Encrypted,
      mailbox: MailBoxTypeEn.Draft,
      read: ReadStatusTypeEn.Read,
      digest: '',
      local_id: new Date().toString(),
    });
  };

  const getMailStat = async () => {
    try {
      const { spam, unread } = await mailHttp.getMailStat();
      setUnreadCount(unread);
      setSpamCount(spam);
    } catch (error) {
      console.error('get mail stat error');
      console.error(error);
    }
  };

  const getRandomBits = async (type: 'detail' | 'draft') => {
    let currentKey: string;
    if (type === 'draft') {
      currentKey = selectedDraft.meta_header?.keys?.[0];
    } else {
      const keys = selectedMail?.meta_header?.keys;
      const { address, ensName } = userLocalStorage.getUserInfo();
      const addrList = [
        selectedMail?.mail_from.address,
        ...(selectedMail?.mail_to.map(item => item.address) || []),
        ...(selectedMail?.mail_cc.map(item => item.address) || []),
        ...(selectedMail?.mail_bcc.map(item => item.address) || []),
      ];
      const idx = addrList.findIndex(addr => {
        const prefix = addr?.split('@')[0].toLocaleLowerCase();
        return prefix === address || prefix === ensName;
      });
      if (idx < 0 || idx > keys.length - 1) {
        throw new Error('not find index from address list');
      }
      currentKey = keys[idx];
    }
    if (!currentKey) {
      throw new Error('not find current key');
    }
    let purePrivateKey = userSessionStorage.getPurePrivateKey();
    if (!purePrivateKey) {
      const { privateKey, salt } = userLocalStorage.getUserInfo();
      purePrivateKey = await getPrivateKey(privateKey, salt);
      userSessionStorage.setPurePrivateKey(purePrivateKey);
    }
    console.log('这里最后一个参数是publicKey不知道从哪里来')
    return decryptMailKey(currentKey, purePrivateKey, '');
  };

  useEffect(() => {
    MMHttp.onUnAuthHandle = logout;
  }, []);

  return (
    <MailBoxContext.Provider
      value={{ checkEncryptable, createDraft, setShowLoading, logout, getMailStat, getRandomBits }}>
      <Layout>
        <MailList />
        {selectedMail && <MailDetail />}
        {selectedDraft && <NewMail />}
      </Layout>
      <Loading show={showLoading} />
    </MailBoxContext.Provider>
  );
}
