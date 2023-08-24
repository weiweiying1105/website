import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

import { useMailListStore, useMailDetailStore, useNewMailStore } from 'lib/zustand-store';
import { userSessionStorage } from 'lib/utils';
import { MarkTypeEn, MetaMailTypeEn, ReadStatusTypeEn, MailListItemType } from 'lib/constants';
import { mailHttp, IMailChangeParams, IMailChangeOptions } from 'lib/http';
import MailListItem from './components/MailListItem';
import Icon from 'components/Icon';

import {
    checkbox,
    trash,
    read,
    starred,
    markUnread,
    temp1,
    spam,
    filter as filterIcon,
    update,
    cancelSelected,
} from 'assets/icons';

const MailListFilters = ['All', 'Read', 'Unread', 'Encrypted', 'UnEncrypted'] as const;
type MailListFiltersType = (typeof MailListFilters)[number];

let lastDraftId = '';

export default function MailList() {
    const {
        filterType,
        pageIndex,
        list,
        setList,
        addPageIndex,
        subPageIndex,
        setUnreadInboxCount,
        setUnreadSpamCount,
    } = useMailListStore();
    const { selectedMail, isDetailExtend } = useMailDetailStore();
    const { selectedDraft } = useNewMailStore();

    const [loading, setLoading] = useState(false);

    const [pageNum, setPageNum] = useState(0);
    const [selectedAll, setSelectedAll] = useState(false);
    const [filter, setFilter] = useState<MailListFiltersType>(null);

    const inputCheckBoxRef = useRef<HTMLInputElement>();

    const handleFilterChange = (currentFilter: MailListFiltersType) => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        if (filter === currentFilter) return;
        setFilter(currentFilter);
    };

    const mailActions = [
        {
            title: 'Trash',
            src: trash,
            httpParams: { mark: MarkTypeEn.Trash },
        },
        {
            title: 'Star',
            src: starred,
            httpParams: { mark: MarkTypeEn.Starred },
        },
        {
            title: 'Spam',
            src: spam,
            httpParams: { mark: MarkTypeEn.Spam },
        },
        {
            title: 'Read',
            src: read,
            httpParams: { read: ReadStatusTypeEn.Read },
        },
        {
            title: 'Unread',
            src: markUnread,
            httpParams: { read: ReadStatusTypeEn.Unread },
        },
    ];

    const handleMailActionsClick = async (httpParams: IMailChangeOptions) => {
        try {
            await mailHttp.changeMailStatus(getSelectedMailsParams(), httpParams);
            await fetchMailList(false);
        } catch (error) {
            console.error(error);
            toast.error('Operation failed, please try again later.');
        }
    };

    const getSelectedList = () => {
        return list.filter(item => item.selected);
    };

    const getSelectedMailsParams = () => {
        const res: IMailChangeParams[] = [];
        getSelectedList().forEach(item => {
            res.push({
                message_id: item.message_id,
                mailbox: item.mailbox,
            });
        });
        return res;
    };

    const fetchMailList = async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const data = await mailHttp.getMailList({
                filter: filterType,
                page_index: pageIndex,
                limit: 20,
            });

            const { mails, page_num, unread } = data;
            const mailsList = mails as MailListItemType[];
            mailsList.forEach(item => {
                item.selected = false;
            });
            setList(mailsList ?? []);
            setPageNum(page_num);
            setUnreadInboxCount(unread ?? 0);
        } catch (error) {
            console.error(error);
            toast.error('Fetch mail list failed, please try again later.');
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    const handleSelectItem = (item: MailListItemType) => {
        item.selected = !item.selected;
        setList([...list]);
        setSelectedAll(list.length && list.every(item => item.selected));
    };

    const handleSelectedAllChange = () => {
        list.map(item => {
            item.selected = !selectedAll;
        });
        setList([...list]);
        setSelectedAll(!selectedAll);
    };

    useEffect(() => {
        const selectedListNum = getSelectedList().length;
        const isIndeterminate = selectedListNum > 0 && selectedListNum < list.length;
        inputCheckBoxRef.current.indeterminate = isIndeterminate;
        setSelectedAll(list.length && list.every(item => item.selected));
    }, [list]);

    useEffect(() => {
        if (userSessionStorage.getUserInfo()?.address) fetchMailList(true);
    }, [pageIndex, filterType]);

    useEffect(() => {
        switch (filter) {
            case 'All':
                list.map(item => {
                    item.selected = true;
                });
                break;
            case null:
                list.map(item => {
                    item.selected = false;
                });
                break;
            case 'Read':
                list.map(item => {
                    item.selected = item.read === ReadStatusTypeEn.Read;
                });
                break;
            case 'Unread':
                list.map(item => {
                    item.selected = item.read === ReadStatusTypeEn.Unread;
                });
                break;
            case 'Encrypted':
                list.map(item => {
                    item.selected = item.meta_type === MetaMailTypeEn.Encrypted;
                });
                break;
            case 'UnEncrypted':
                list.map(item => {
                    item.selected = item.meta_type === MetaMailTypeEn.Plain;
                });
                break;
            default:
                break;
        }
        setList([...list]);
        setSelectedAll(list.length && list.every(item => item.selected));
    }, [filter]);

    useEffect(() => {
        setFilter(null);
    }, [filterType]);

    useEffect(() => {
        if (!!lastDraftId && !selectedDraft?.message_id) {
            // 代表从草稿组件出来，此时需要刷新列表
            fetchMailList(false);
        }
        lastDraftId = selectedDraft?.message_id;
    }, [selectedDraft?.message_id]);

    return (
        <div
            className={`flex flex-col h-full transition-all ${
                !selectedMail ? 'flex-1 min-w-0' : isDetailExtend ? 'w-0 invisible' : 'w-300'
            }`}>
            <div className="flex flex-row w-full justify-between px-20 pb-7 pt-20">
                <div className="flex flex-row space-x-14 items-center">
                    <input
                        type="checkbox"
                        ref={inputCheckBoxRef}
                        checked={selectedAll}
                        onChange={handleSelectedAllChange}
                        className="checkbox checkbox-sm"
                    />
                    <Icon
                        url={update}
                        className="w-20 h-20"
                        onClick={() => {
                            fetchMailList(true);
                        }}
                    />
                    <div className={`dropdown dropdown-bottom ${isDetailExtend ? 'invisible' : ''}`}>
                        <label tabIndex={0} className="cursor-pointer flex items-center">
                            <Icon url={filterIcon} className="w-20 h-20" />
                            <span className="text-[14px]">{filter}</span>
                        </label>
                        <ul
                            tabIndex={0}
                            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-130">
                            {MailListFilters.map((item, index) => {
                                return (
                                    <li
                                        onClick={() => {
                                            handleFilterChange(item);
                                        }}
                                        key={index}>
                                        <a>{item}</a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {getSelectedList().length > 0 && (
                        <div className="flex gap-14">
                            {mailActions.map((item, index) => {
                                return (
                                    <Icon
                                        title={item.title}
                                        url={item.src}
                                        key={index}
                                        onClick={async () => {
                                            await handleMailActionsClick(item.httpParams);
                                        }}
                                        className="w-20 h-20 self-center"
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="flex flex-row justify-end space-x-20 text-xl text-[#7F7F7F]">
                    <button
                        disabled={pageIndex === 1}
                        className="w-20 h-20 disabled:opacity-40"
                        onClick={() => {
                            if (pageIndex > 1) subPageIndex();
                        }}>
                        {'<'}
                    </button>
                    <button
                        className="w-20 h-20 disabled:opacity-40"
                        disabled={pageIndex === pageNum}
                        onClick={() => {
                            if (pageIndex < pageNum) addPageIndex();
                        }}>
                        {'>'}
                    </button>
                </div>
            </div>

            <div className="flex flex-col overflow-y-auto overflow-x-hidden flex-1 relative">
                {loading ? (
                    <div className="flex items-center justify-center pt-200">
                        <span className="loading loading-ring loading-lg bg-[#006AD4]"></span>
                    </div>
                ) : list.length ? (
                    list.map((item, index) => {
                        return (
                            <MailListItem
                                key={item.message_id}
                                mail={item}
                                onSelect={() => {
                                    handleSelectItem(item);
                                }}
                            />
                        );
                    })
                ) : (
                    <div className="text-center pt-24">{'<No Mail>'}</div>
                )}
            </div>
        </div>
    );
}
