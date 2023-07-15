import { useState, useEffect } from 'react';

import { useMailListStore, useMailDetailStore, useNewMailStore, useUtilsStore } from 'lib/zustand-store';
import { userSessionStorage, mailSessionStorage } from 'lib/utils';
import { FilterTypeEn, IMailContentItem, MarkTypeEn, MetaMailTypeEn, ReadStatusTypeEn } from 'lib/constants';
import { mailHttp, IMailChangeParams } from 'lib/http';
import MailListItem from './components/MailListItem';
import Icon from 'components/Icon';

import { checkbox, trash, read, starred, markUnread, temp1, spam, filter, update, cancelSelected } from 'assets/icons';

let isFetching = false;
const MailListFilterMap: Partial<Record<FilterTypeEn, string>> = {
    [FilterTypeEn.Inbox]: 'All',
    [FilterTypeEn.Read]: 'Read',
    [FilterTypeEn.Unread]: 'Unread',
    [FilterTypeEn.Encrypted]: 'Encrypted',
};

export default function MailList() {
    const {
        filterType,
        setFilterType,
        pageIndex,
        addPageIndex,
        subPageIndex,
        setUnreadInboxCount,
        setUnreadSpamCount,
    } = useMailListStore();
    const { setDetailFromList, setDetailFromNew, setIsMailDetail, detailFromNew } = useMailDetailStore();
    const { setIsWriting } = useNewMailStore();
    const { removeAllState } = useUtilsStore();

    const [loading, setLoading] = useState(false);
    const [list, setList] = useState<IMailContentItem[]>([]);
    const [pageNum, setPageNum] = useState(0);
    const [selectList, setSelectList] = useState<IMailContentItem[]>([]);
    const [isAll, setIsAll] = useState(false);

    const sixList = [
        {
            src: trash,
            handler: async () => {
                await mailHttp.changeMailStatus(getMails(), MarkTypeEn.Trash, undefined);
                await fetchMailList(false);
            },
        },
        {
            src: starred,
            handler: async () => {
                await mailHttp.changeMailStatus(getMails(), MarkTypeEn.Starred, undefined);
                await fetchMailList(false);
            },
        },
        {
            src: spam,
            handler: async () => {
                await mailHttp.changeMailStatus(getMails(), MarkTypeEn.Spam, undefined);
                await fetchMailList(false);
            },
        },
        {
            src: read,
            handler: async () => {
                await mailHttp.changeMailStatus(getMails(), undefined, ReadStatusTypeEn.read);
                await fetchMailList(false);
            },
        },
        {
            src: markUnread,
            handler: async () => {
                await mailHttp.changeMailStatus(getMails(), undefined, ReadStatusTypeEn.unread);
                await fetchMailList(false);
            },
        },
    ];

    const getMails = () => {
        const res: IMailChangeParams[] = [];
        selectList?.forEach(item => {
            res.push({
                message_id: item.message_id,
                mailbox: item.mailbox,
            });
        });
        return res;
    };

    const fetchMailList = async (showLoading = true) => {
        if (isFetching) return;
        if (showLoading) setLoading(true);
        try {
            isFetching = true;
            const mailListStorage = mailSessionStorage.getMailListInfo();
            const isMailListStorageExist =
                mailListStorage?.data?.page_index === pageIndex && mailListStorage?.filter === filterType;
            if (isMailListStorageExist && showLoading) {
                //showLoading=true的时候相同的邮件列表已经改变了，需要重新取
                console.log('mail list from storage');
                setList(mailListStorage?.data?.mails ?? []); //用缓存更新状态组件
                setPageNum(mailListStorage?.data?.page_num);
                setUnreadInboxCount(mailListStorage.data?.unread ?? 0);
            } else {
                ////////不是缓存 重新取
                mailSessionStorage.clearMailListInfo();
                console.log('mail list from server');
                const data = await mailHttp.getMailList({
                    filter: filterType,
                    page_index: pageIndex,
                    limit: 20,
                });

                const { mails, page_num, unread } = data;
                setList(mails ?? []);
                setPageNum(page_num);
                setUnreadInboxCount(unread ?? 0);
                const mailListStorage = {
                    //设置邮件列表缓存
                    data: data,
                    filter: filterType,
                };
                mailSessionStorage.setMailListInfo(mailListStorage);
            }
        } catch (error) {
        } finally {
            if (showLoading) setLoading(false);
            isFetching = false;
        }
    };

    useEffect(() => {
        if (userSessionStorage.getUserInfo()?.address) fetchMailList(true);
        //getMailDetail();  预加载feature abort
    }, [pageIndex, filterType]);

    useEffect(() => {
        if (userSessionStorage.getUserInfo()?.address) fetchMailList(false);
        //getMailDetail();  预加载feature abort
    }, [detailFromNew]);

    const handleChangeSelectList = (item: IMailContentItem, isSelect?: boolean) => {
        if (isSelect) {
            const nextList = selectList.slice();
            nextList.push(item);
            setSelectList(nextList);
        } else {
            const nextList = selectList.filter(i => i.message_id !== item.message_id && i.mailbox !== item.mailbox);
            setSelectList(nextList);
        }
    };

    const handleChangeMailStatus = async (
        inputMails?: IMailChangeParams[],
        mark?: MarkTypeEn,
        read?: ReadStatusTypeEn
    ) => {
        const mails = inputMails ?? getMails();
        try {
            await mailHttp.changeMailStatus(mails, mark, read);
        } catch (e) {
        } finally {
            fetchMailList(false);
        }
    };

    return (
        <div className="flex flex-col flex-1 min-w-0 h-full">
            <div className="flex flex-row w-full justify-between px-20 py-7">
                <div className="flex flex-row space-x-14 pt-4 items-center">
                    <input
                        type="checkbox"
                        checked={isAll}
                        onClick={() => {
                            setIsAll(!isAll);
                        }}
                        onChange={() => {}}
                        className="checkbox checkbox-sm"
                    />
                    <Icon
                        url={update}
                        className="w-20 h-20"
                        onClick={() => {
                            removeAllState();
                            mailSessionStorage.clearMailListInfo();
                            fetchMailList(true);
                        }}
                    />
                    <div className="dropdown dropdown-bottom">
                        <label tabIndex={0} className="cursor-pointer flex items-center">
                            <Icon url={filter} className="w-20 h-20" />
                            <span className="text-[14px]">{MailListFilterMap[filterType]}</span>
                        </label>
                        <ul
                            tabIndex={0}
                            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-110">
                            {Object.keys(MailListFilterMap).map((key, index) => {
                                const filter = Number(key) as FilterTypeEn;
                                return (
                                    <li
                                        onClick={e => {
                                            if (document.activeElement instanceof HTMLElement) {
                                                document.activeElement.blur();
                                            }
                                            if (filter === filterType) return;
                                            setFilterType(filter);
                                        }}
                                        key={index}>
                                        <a>{MailListFilterMap[filter]}</a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="h-14 flex gap-10">
                        {selectList.length
                            ? sixList.map((item, index) => {
                                  return (
                                      <Icon
                                          url={item.src}
                                          key={index}
                                          onClick={item.handler}
                                          className="w-13 h-auto self-center"
                                      />
                                  );
                              })
                            : null}
                    </div>
                </div>

                <div className="flex flex-row justify-end space-x-20 text-xl text-[#7F7F7F]">
                    <button
                        disabled={pageIndex === 1}
                        className="w-24 disabled:opacity-40"
                        onClick={() => {
                            if (pageIndex > 1) subPageIndex();
                        }}>
                        {'<'}
                    </button>
                    {/*<span className='text-sm pt-3'>{pageIdx ?? '-'} /{pageNum ?? '-'}</span>//////显示邮件的数量*/}
                    <button
                        className="w-24 disabled:opacity-40"
                        disabled={pageIndex === pageNum}
                        onClick={() => {
                            if (pageIndex < pageNum) addPageIndex();
                        }}>
                        {'>'}
                    </button>
                </div>
            </div>

            <div className="flex flex-col overflow-auto flex-1 relative">
                {loading ? (
                    <div className="flex items-center justify-center pt-200">
                        <span className="loading loading-infinity loading-lg bg-[#006AD4]"></span>
                    </div>
                ) : (
                    list.map((item, index) => {
                        return (
                            <MailListItem
                                key={index}
                                mail={item}
                                onSelect={() => {}}
                                onRefresh={async () => {
                                    await fetchMailList(false);
                                }}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
}
