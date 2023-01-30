import Image from 'next/image';
import encrypt from '@assets/encrypt.svg';
import moment, { Moment } from 'moment';
import Icon from '@components/Icon';
import {
    IPersonItem,
    MarkTypeEn,
    MetaMailTypeEn,
    MailTypeIconMap,
  } from 'pages/home/interfaces';
import { checkbox, favorite, markFavorite, selected, white } from 'assets/icons';
interface IMailItemProps {
    subject: string;
    from: IPersonItem;
    date: string;
    isRead: boolean;
    select?: boolean;
    mark?: MarkTypeEn;
    metaType?: MetaMailTypeEn;
    abstract?: string;
    onClick: () => void;
    onSelect: (isSelected: boolean) => void;
    onFavorite: (isSelected: boolean) => void;
}





export default function MailListItem({
    subject,
    from,
    date,
    isRead,
    onClick,
    onSelect,
    onFavorite,
    select,
    mark,
    metaType,
    abstract,
  }: IMailItemProps) {
    console.log('render');
    return (
        <div className = {isRead ? '' : 'font-bold'}>
      <div className='h-38 flex flex-row py-6 px-18 justify-between text-sm gap-35'>
        <div className='flex flex-row gap-15'>
            <div className='pt-2'><Icon
            url={checkbox}
            checkedUrl={selected}
            onClick={onSelect}
            select={select}
            tip={'select'}
        /></div>
        <div className='pt-2'><Icon
            url={favorite}
            checkedUrl={markFavorite}
            onClick={onFavorite}
            select={mark === MarkTypeEn.Starred}
            tip={'star'}
        />
        </div>
        <Icon
            url={white}
            checkedUrl={encrypt}
            onClick={onFavorite}
            //select={metaType === MetaMailTypeEn.Encrypted}
            select={isRead === false}
            tip={'star'}
        />
        </div>
        <span className='pt-2 text-[#333333] omit w-120 ' onClick={onClick} >
        {from?.name && from.name.length > 0 ? from.name : from.address}
        </span>
        <span className='pt-2 text-[#333333] omit w-135 ' onClick={onClick} >{subject}</span>
          {/*<div className='h-14 w-1 rounded-1 bg-[#333333] align-center'/>*/}
        <div className='pt-2 text-[#999999] omit min-w-0 flex-1' onClick={onClick} >{abstract}</div>
        <div className='pt-2 text-[#999999]'>
        {moment(date).calendar(null, {
            sameDay: 'LT',
            lastDay: '[Yesterday] LT',
            lastWeek: 'LL',
            sameElse: 'LL',
            })}
            </div>
</div>
          {/*
          <Icon
            url={favorite}
            checkedUrl={markFavorite}
            onClick={onFavorite}
            select={mark === MarkTypeEn.Starred}
            tip={'star'}
          />
          {metaType != undefined && metaType != MetaMailTypeEn.Plain && (
            <Popover
              title={null}
              content={
                <div>
                  This email is{' '}
                  {metaType == MetaMailTypeEn.Signed ? 'signed' : 'encrypted'}{' '}
                  {'by ' + from?.address}
                </div>
              }
            >
              <span>
                <Icon url={MailTypeIconMap?.[metaType]} />
              </span>
            </Popover>
            )}*/}

        {/*<div className={styles.detail} onClick={onClick}>
          <div className={cn(styles.left, isRead ? null : styles.unread)}>
            <div className={styles.infoBar}>
              <Popover
                title={null}
                content={
                  <div>
                    {from?.name} {'<' + (from?.address ?? '') + '>'}
                  </div>
                }
              >
                <span className={styles.from}>
                  {from?.name && from.name.length > 0 ? from.name : from.address}
                </span>
              </Popover>
              <div className={styles.subject}>{subject}</div>
              <div className={styles.abstract}>
                {metaType == MetaMailTypeEn.Encrypted
                  ? '*'.repeat(abstract?.length ?? 1)
                  : abstract}
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.date}>
              {moment(date).calendar(null, {
                sameDay: 'LT',
                lastDay: '[Yesterday] LT',
                lastWeek: 'LL',
                sameElse: 'LL',
              })}
            </div>
          </div>
            </div>*/}
      </div>
    );
    }