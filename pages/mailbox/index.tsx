import { useMailDetailStore, useNewMailStore } from 'lib/zustand-store';
import { userHttp, mailHttp } from 'lib/http';
import { IPersonItem, MetaMailTypeEn } from 'lib/constants';
import { userSessionStorage } from 'lib/utils';
import { createEncryptedMailKey } from 'lib/encrypt';
import MailBoxContext from 'context/mail';
import Layout from 'components/Layout';
import MailList from 'components/MailList';
import MailDetail from 'components/MailDetail';
import NewMail from 'components/NewMail';

export default function MailBoxPage() {
    const { selectedMail } = useMailDetailStore();
    const { selectedDraft } = useNewMailStore();

    const checkEncryptable = async (receivers: IPersonItem[]) => {
        const getSinglePublicKey = async (receiver: IPersonItem) => {
            try {
                const encryptionData = await userHttp.getEncryptionKey(receiver.address.split('@')[0]);
                return encryptionData.encryption_public_key;
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

    const createDraft = async () => {
        const { publicKey, address } = userSessionStorage.getUserInfo();
        const { key, randomBits } = await createEncryptedMailKey(publicKey, address);
        const { message_id } = await mailHttp.createDraft(MetaMailTypeEn.Encrypted, key);
        return {
            message_id,
            randomBits,
        };
    };

    return (
        <MailBoxContext.Provider value={{ checkEncryptable, createDraft }}>
            <Layout>
                <MailList />
                {selectedMail && <MailDetail />}
                {selectedDraft && <NewMail />}
            </Layout>
        </MailBoxContext.Provider>
    );
}
