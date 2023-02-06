import MailListItem from '@components/MailItem';
import { useState, useEffect, useRef } from 'react';
import Icon from '@components/Icon';
//import { useHistory, useLocation } from 'react-router-dom';
import { useRouter } from 'next/router'
import Image from 'next/image';
import turnLeft from '@assets/turnLeft.svg';
import turnRight from '@assets/turnRight.png';
import Collection from '@assets/Collection.svg';
import Delete from '@assets/Delete.svg';
import Read from '@assets/Read.svg';
import Unread from '@assets/Unread.svg';
import filter from '@assets/filter.svg';
import update from '@assets/update.svg';
import {
  FilterTypeEn,
  getMailBoxType,
  IMailItem,
  MailBoxTypeEn,
  MarkTypeEn,
  MetaMailTypeEn,
  ReadStatusTypeEn,
} from 'constants/interfaces';
import { changeMailStatus, getMailList, IMailChangeParams } from 'services/home';
//import styles from './index.less';
//import Icon from '@/components/Icon';
import {
  checkbox,
  markFavorite,
  selected,
  favorite,
  trash,
  read,
  leftArrow,
  rightArrow,
} from 'assets/icons';
//import { connect, history } from 'umi';
import { setRandomBits } from 'utils/storage/user';

function MailList(props: any) {
    console.log('maillist');
  //const { location = useLocation() } = props;
  const router = useRouter()  
  const queryRef = useRef(0);
  //const history = useHistory();
  const mailBox = getMailBoxType(queryRef.current);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<IMailItem[]>([]);
  //const fetchIndex = sessionStorage.getItem('pageIdx')
  //  ? Number(sessionStorage.getItem('pageIdx'))
  //  : 1;
  const [pageIdx, setPageIdx] = useState(
    props?.pageIndex?.currentIndex ? props?.pageIndex?.currentIndex : 1,
  );
  const [pageNum, setPageNum] = useState(0);
  const [inboxType, setInboxType] = useState(Number(mailBox));
  const [selectList, setSelectList] = useState<IMailItem[]>([]);
  const [isAll, setIsAll] = useState(false);
  const [isAllFavorite, setIsAllFavorite] = useState(false);
  //const [clickItemInfo, setClickItemInfo] = useState(sessionStorage.getItem('clickInfo')? sessionStorage.getItem('clickInfo') : '');
  //const [hover, setHover] = useState<string | undefined>(undefined);
  const getMails = () => {
    const res: IMailChangeParams[] = [];

    selectList?.forEach((item) => {
      res.push({
        message_id: item.message_id,
        mailbox: item.mailbox,
      });
    });

    return res;
  };

  const fetchMailList = async (showLoading = true) => {
    //console.log('pageindx: '+sessionStorage.getItem("pageIdx"));
    //console.log('inbox: '+queryRef.current);
    //console.log('pageindxstate: '+pageIdx);
    //console.log('end');
    if (showLoading) {
      setLoading(true);
    }
    console.log('infetchmaillist');
    //console.log(props?.pageIndex?.totalIndex);
    if (props?.pageIndex && typeof props?.pageIndex?.totalIndex == 'undefined')
      setPageIdx(1); //undefined就证明是sidemenu传的state，代表了初次渲染时点击了别的inbox，因此返回第一页
    //if (pageNum==0) {setPageIdx(0);
    //setPageIdx(1);};
    try {
      //console.log(props?.data);
      //props.setUnreadCount({
      //  unread: 3,
      //  total: 3,
      //});
      //console.log("page1 "+props.pageIndex.currentIndex);
      //console.log("total1 "+props.pageIndex.totalIndex);
      //console.log('try');
      //console.log(props?.data?.pageIndex);
      //console.log(props?.data?.inboxType);
      //console.log(props?.data?.content);
      if (
        props?.data &&
        props?.data?.pageIndex == pageIdx &&
        props?.data?.inboxType == queryRef.current &&
        props?.data?.mailList.length !== 0
      ) {
        console.log('shi');
        setList(props?.data?.mailList);
        //setPageIdx(data?.page_index);
        setPageNum(props?.data?.totalPage);
      } else {
        const { data } = await getMailList({
          filter: queryRef.current,
          page_index: pageIdx,
        });
        console.log('this');
        console.log(data);
        //props.setPageIndex({
        //  currentIndex: pageIdx,
        //  totalIndex: data?.page_num,
        //})
        //console.log('this');
        //console.log(pageIdx);
        //console.log(data?.page_num);

        ///////////////////////////props.setPageIndex({
        ////////////////////////  currentIndex: pageIdx,
        ////////////////////  totalIndex: data?.page_num,
        //////////////////////////////});
        //console.log("page1 "+props.pageIndex.currentIndex);
        //console.log("total1 "+props.pageIndex.totalIndex);
        setList(data?.mails ?? []);
        //setPageIdx(data?.page_index);
        setPageNum(data?.page_num);
        props.setUnreadCount({
          unread: data?.unread,
          total: data?.total,
        });
      }
    } catch {
      //notification.error({
      //  message: 'Network Error',
      //  description: 'Can not fetch mail list for now.',
      //});
    } finally {
      if (showLoading) {
        setLoading(false);
      }
      //setPageIdx(fetchIndex);
    }
    console.log('finally');
    console.log(list);
    //console.log(pageNum);
    //因为缓存的时候每次读data，所以如果old data有数据证明old data是下一次返回要用的，把old data变成data，现在这一页存进old data里
    ////////////////////props.setDataList({
    ////////////////  pageIndex: props?.data?.oldPageIndex ? props.data.oldPageIndex : pageIdx,
     //////////// inboxType: props?.data?.oldInboxType
    ///////////////    ? props.data.oldInboxType
    /////////////////////    : queryRef.current,
      //mailList: props?.data?.oldMailList ? props.data.oldMailList : list,
      //totalPage: props?.data?.oldTotalPage ? props.data.oldTotalPage : pageNum,
    ////////////////  mailList: list, //这里的list和pagenum实际上就是old data的state，由于在这个阶段未更新所以可以直接用
    /////////////  totalPage: pageNum,
    //////////////  oldPageIndex: pageIdx,
    ///////////  oldInboxType: queryRef.current,
    //////////////////});
  };

  useEffect(() => {
    console.log('useEffect')
    //if (props?.pageIndex?.currentIndex && props?.pageIndex?.currentIndex!=pageIdx)
    //setPageIdx(props.pageIndex.currentIndex);
    ///////////////props.setPageIndex({
    /////////////////  currentIndex: pageIdx,
    ///////////////  totalIndex: pageNum,
    ///////////////});
    ///////////queryRef.current = location?.query?.filter
    /////////////  ? Number(location?.query?.filter)
    //////////////  : 0;
    //if (!sessionStorage.getItem('pageIdx')) setPageIdx(1);
    /////////////setInboxType(queryRef.current);
    fetchMailList();
  }, [pageIdx, //location?.query
                                                        ]);
  const handleChangeSelectList = (item: IMailItem, isSelect?: boolean) => {
    if (isSelect) {
      const nextList = selectList.slice();
      nextList.push(item);
      setSelectList(nextList);
    } else {
      const nextList = selectList.filter(
        (i) => i.message_id !== item.message_id && i.mailbox !== item.mailbox,
      );
      setSelectList(nextList);
    }
  };

  const handleChangeMailStatus = async (
    inputMails?: IMailChangeParams[],
    mark?: MarkTypeEn,
    read?: ReadStatusTypeEn,
  ) => {
    const mails = inputMails ?? getMails();
    try {
      await changeMailStatus(mails, mark, read);
    } catch {
      //notification.error({
      //  message: 'Failed',
      //  description: 'Sorry, network problem.',
      //});
    } finally {
      fetchMailList(false);
    }
  };

  const handleClickMail = (
    id: string,
    type: MetaMailTypeEn,
    mailbox: MailBoxTypeEn,
    read: number,
  ) => {
    const pathname =
      queryRef.current === FilterTypeEn.Draft ? '/home/new' : '/home/mail';
    setRandomBits(undefined); // clear random bits
    if (!read) {
      const mails = [{ message_id: id, mailbox: Number(mailbox) }];
      changeMailStatus(mails, undefined, ReadStatusTypeEn.read);
    }
    //history.replace({
    //pathname: location.pathname,
    //state: { pageIdx },
    //});
    //setPageIdx(fetchIndex);
    //sessionStorage.setItem('pageIdx', String(pageIdx));
    //sessionStorage.setItem('inboxType', String(inboxType));
    //setinboxType(inboxType);
    router.push({
    pathname,
    query: {
        id,
        type: type + '',
    },
      //  state: { pageIdx, inboxType },
    });
  };
  return (
    <div className='flex flex-col flex-1 h-0 bg-white rounded-10'>
        <div className='flex flex-row w-full justify-between p-13 py-7'>
          <div className='flex flex-row space-x-15'>
          <Icon      ///////////最初设计稿的提示
            url={checkbox}
            checkedUrl={selected}
            className='pt-3'
            onClick={(res: boolean) => {
                setSelectList(res ? list?.map((item) => item) : []);
                setIsAll(res);
            }}
            select={isAll}/>            
            <Icon   
            className='pt-2'
            url={filter}/>            
            <Icon      ///////////最初设计稿的提示
            url={update}/>
          </div>
          <div className='flex flex-row justify-end space-x-20'>
            <button
                disabled={pageIdx===1}
                className='w-24 text-xl'
                onClick={() => {
                  setPageIdx((prev:number) => {
                    if (prev - 1 > 0) {
                      return prev - 1;
                    } else return prev;
                  });
                }}>{"<"}</button>
          {/*<span className='text-sm pt-3'>{pageIdx ?? '-'} /{pageNum ?? '-'}</span>//////显示邮件的数量*/}
            <button
                className='w-24 text-xl'
                disabled={pageIdx===pageNum}
                onClick={() => {
                  setPageIdx((prev:number) => {
                    if (prev + 1 <= pageNum) {
                      return prev + 1;
                    } else return prev;
                  });
                }}>{">"}</button>
            </div>  
            {/*<div className='flex flex-row space-x-50 px-15'>  //最初设计稿针对mailList的四种操作
                <Icon
                url={Collection}
                select={isAllFavorite}
                onClick={(res) => {
                handleChangeMailStatus(
                undefined,
                res ? MarkTypeEn.Starred : MarkTypeEn.Normal,
                );
                setIsAllFavorite(res);
                }}
                tip={'star'}/>
                <Icon
                    url={Delete}
                    onClick={() => {
                        handleChangeMailStatus(
                        undefined,
                        queryRef.current == 3 ? MarkTypeEn.Deleted : MarkTypeEn.Trash,
                    );
                    }}
                    tip={'delete'}
                />  
                <Icon
                    url={Read}
                    data-tip="marked read"
                    onClick={() => {
                        handleChangeMailStatus(
                        undefined,
                        undefined,
                        ReadStatusTypeEn.read,
                        );
                    }}
                    tip={'mark read'}
                />
                <Icon
                        url={Unread}
                        data-tip="marked unread"
                        onClick={() => {
                        handleChangeMailStatus(
                            undefined,
                            undefined,
                            ReadStatusTypeEn.unread,
                        );
                        }}
                        tip={'mark unread'}
                    />
                      </div>*/}
        </div>
    {/*<div className='h-28 flex flex-row pb-6 px-18 justify-between text-sm gap-35 text-[#999999] text-center'>
        <div className='flex flex-row justify-around w-102 px-5'>
            <Icon      ///////////最初设计稿的提示
            url={checkbox}
            checkedUrl={selected}
            onClick={(res: boolean) => {
                setSelectList(res ? list?.map((item) => item) : []);
                setIsAll(res);
            }}
            select={isAll}/>
            <div className=''>Option</div>
        </div>
        <span className='w-120 '>Address</span>
        <span className='w-135 '>Theme</span>
        {/*<div className='h-14 w-1 rounded-1 bg-[#333333] align-center'/>
        <div className='min-w-0 flex-1 overflow-hidden'>Abstract</div>
        <div className='w-120'>Date</div>
    </div>*/}
    <div className='flex flex-col overflow-auto flex-1 h-0 pl-8'>
        {list.map((item,index) => { 
        return (<MailListItem
            key={index}
            mark={item?.mark}
            from={item.mail_from}
            subject={item.subject}
            date={item.mail_date}
            metaType={item.meta_type as MetaMailTypeEn}
            isRead={
                item.read == ReadStatusTypeEn.read //||
                //sessionStorage.getItem(item?.message_id) !== null
            } // message_id as primary key
            abstract={item?.digest}
            onClick={() => {
              ////////////////props.setDataList({
                //点击了邮件那肯定是需要返回最新的一页，因此重新把store更新
                ///////////////pageIndex: pageIdx,
                /////////////////inboxType: queryRef.current,
                //////////////mailList: list,
                ////////////////totalPage: pageNum,
              /////////////////});
              sessionStorage.setItem(item?.message_id, item?.message_id); // set read in sessionstorage for update without fetching maillist
              //console.log(item?.message_id);
              handleClickMail(
                item.message_id,
                item.meta_type,
                item.mailbox,
                item.read,
              );
            }}
            select={
              selectList.findIndex(
                (i) =>
                  i.message_id === item.message_id &&
                  i.mailbox === item.mailbox,
              ) >= 0
            }
            onFavorite={(isSelect: boolean) => {
              handleChangeMailStatus(
                [
                  {
                    message_id: item?.message_id,
                    mailbox: item?.mailbox,
                  },
                ],
                isSelect ? MarkTypeEn.Starred : MarkTypeEn.Normal,
              );
            }}
            onSelect={(isSelect) => {
              handleChangeSelectList(item, isSelect);
            }}
          />)}
          )}
        </div>

  </div>
  );
}

const mapStateToProps = (state: any) => {
  return state.user ?? {};
};

//const mapIndexStateToProps = (state: any) => {
//  return state.pageIndex ?? {};
//};

const mapDispatchToProps = (
  dispatch: (arg0: { type: string; payload: any }) => any,
) => ({
  setUnreadCount: (data: any) =>
    dispatch({
      type: 'user/setUnreadCount',
      payload: data,
    }),
  setPageIndex: (data: any) =>
    dispatch({
      type: 'user/setPageIndex',
      payload: data,
    }),
  setDataList: (data: any) =>
    dispatch({
      type: 'user/setDataList',
      payload: data,
    }),
});

//export default connect(mapStateToProps, mapDispatchToProps)(MailList);
export default MailList;