import moment from 'moment';
import Image from 'next/image';
import { toast } from 'react-toastify';

import { IPersonItem, MarkTypeEn, MetaMailTypeEn, IMailContentItem, ReadStatusTypeEn } from 'lib/constants';
import { mailHttp, IMailChangeParams } from 'lib/http';
import { userSessionStorage, mailSessionStorage } from 'lib/utils';
import Icon from 'components/Icon';
import Dot from 'components/Dot';
import { checkbox, favorite, markFavorite, selected, white, trash, markUnread } from 'assets/icons';
import styles from './index.module.scss';
interface IMailItemProps {
    mail: IMailContentItem;
    onSelect: (mail: IMailContentItem) => void;
    onRefresh: () => Promise<void>;
}

export default function MailListItem({ mail, onSelect, onRefresh }: IMailItemProps) {
    const getIsRead = (mail: IMailContentItem) => {
        return mail.read == ReadStatusTypeEn.read;
    };

    const getMailFrom = (mail: IMailContentItem): string => {
        return mail.mail_from?.name && mail.mail_from.name.length > 0 ? mail.mail_from.name : mail.mail_from.address;
    };

    const handleStar = async () => {};

    const handleDelete = async () => {};

    const handleUnread = async () => {};

    const handleClick = async () => {
        // userSessionStorage.setRandomBits(''); // clear random bits
        // if (!getIsRead(mail)) {
        //     const mails = [{ message_id: mail?.message_id, mailbox: Number(mail.mailbox) }];
        //     await mailHttp.changeMailStatus(mails, undefined, ReadStatusTypeEn.read);
        // }
        // fetchMailList(false);
        // if (filterType === FilterTypeEn.Draft) {
        //     setDetailFromNew(item);
        //     setIsWriting(true);
        // } else {
        //     setDetailFromList(item);
        //     setIsMailDetail(true);
        // }
    };

    const handleChangeMailStatus = async (
        inputMails?: IMailChangeParams[],
        mark?: MarkTypeEn,
        read?: ReadStatusTypeEn
    ) => {
        const mails = inputMails ?? getMails();
        try {
            await mailHttp.changeMailStatus(mails, mark, read);
        } catch (error) {
            console.error(error);
            toast.error('Operation failed, please try again later');
        } finally {
            onRefresh();
        }
    };

    return (
        <div
            className={`text-[14px] flex flex-row px-20 items-center group h-36 cursor-pointer ${styles.mailListItem}`}>
            <div className="flex flex-row gap-14">
                <input type="checkbox" className="checkbox checkbox-sm" />
                <Icon
                    url={favorite}
                    checkedUrl={markFavorite}
                    onClick={handleStar}
                    className="w-20 h-20"
                    select={mail.mark === MarkTypeEn.Starred}
                    tip={'star'}
                />
            </div>
            <div className="text-[#333333] font-bold w-140 ml-14 omit">
                <span className={`${getIsRead(mail) ? 'text-black text-opacity-60' : ''}`} title={getMailFrom(mail)}>
                    {getMailFrom(mail)}
                </span>
            </div>
            <div className="text-[#333333] flex-1 w-0 ml-14 omit">
                <Dot color={mail.meta_type === MetaMailTypeEn.Encrypted ? '#006AD4' : '#fff'} />
                {/* <span className={isRead ? 'text-black text-opacity-60' : ''}>{subject || '( no subject )'}</span> */}
                <span className={`ml-8 ${getIsRead(mail) ? 'text-black text-opacity-60' : ''}`}>
                    {
                        'Why MicrosoftWhy MicrosoftWhy MicrosoftWhy MicrosoftWhy MicrosoftWhy Microsoft, Why Microsoft Bing + ChatGPT Doesn’t Make Business Sense (now) | Sam Warain in DataDrivenInvestor DataDrivenInvesri'
                    }
                </span>
                <span className="pt-4 pl-2 pr-7 text-[#333333]">{'-'}</span>
                <span className="pt-4 text-[#999999] min-w-0 flex-1">{mail.digest || '( no abstract )'}</span>
            </div>
            <div className="w-100 text-right">
                <div className="text-[#999999] group-hover:hidden">{moment(mail.mail_date).format('MMM D')}</div>
                <div className="hidden group-hover:flex items-center justify-end">
                    <div onClick={handleDelete} title="delete mail">
                        <Image src={trash} alt="delete mail" />
                    </div>
                    <div onClick={handleUnread} title="mark unread mail" className="ml-12">
                        <Image src={markUnread} alt="markUnread mail" className="scale-125" />
                    </div>
                </div>
            </div>
        </div>
    );
}
