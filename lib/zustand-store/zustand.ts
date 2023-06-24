import { create } from 'zustand';
import { IMailContentItem, FilterTypeEn } from 'lib/constants';

interface IMailListState {
    filterType: FilterTypeEn;
    pageIndex: number;
    unReadCount: number;
    setFilterType: (filterType: FilterTypeEn) => void;
    addPageIndex: () => void;
    subPageIndex: () => void;
    resetPageIndex: () => void;
    setUnreadCount: (unReadCount: number) => void;
}
export const useMailListStore = create<IMailListState>()(set => ({
    filterType: FilterTypeEn.Inbox,
    pageIndex: 1,
    unReadCount: 0,
    setFilterType: (filterType: FilterTypeEn) => set(() => ({ filterType })),
    addPageIndex: () => set(state => ({ pageIndex: state.pageIndex + 1 })),
    subPageIndex: () => set(state => ({ pageIndex: state.pageIndex - 1 })),
    resetPageIndex: () => set({ pageIndex: 1 }),
    setUnreadCount: (unReadCount: number) => set(() => ({ unReadCount })),
}));

interface IMailDetailState {
    detailFromList: IMailContentItem;
    detailFromNew: IMailContentItem;
    isMailDetail: boolean;
    setDetailFromList: (item: IMailContentItem) => void;
    setDetailFromNew: (item: IMailContentItem) => void;
    setIsMailDetail: (isMailDetail: boolean) => void;
}
export const useMailDetailStore = create<IMailDetailState>()(set => ({
    detailFromList: null,
    detailFromNew: null,
    isMailDetail: false,
    setDetailFromList: (detailFromList: IMailContentItem) => set(() => ({ detailFromList })),
    setDetailFromNew: (detailFromNew: IMailContentItem) => set(() => ({ detailFromNew })),
    setIsMailDetail: (isMailDetail: boolean) => set(() => ({ isMailDetail })),
}));

interface INewMailState {
    isWriting: boolean;
    setIsWriting: (isWriting: boolean) => void;
}
export const useNewMailStore = create<INewMailState>()(set => ({
    isWriting: false,
    setIsWriting: (isWriting: boolean) => set(() => ({ isWriting })),
}));

interface IUtilsState {
    removeAllState: () => void;
}
export const useUtilsStore = create<IUtilsState>()(set => ({
    removeAllState: () => {
        const { setFilterType, resetPageIndex, setUnreadCount } = useMailListStore.getState();
        const { setDetailFromList, setDetailFromNew } = useMailDetailStore.getState();
        setFilterType(0);
        resetPageIndex();
        setUnreadCount(0);
        setDetailFromList(null);
        setDetailFromNew(null);
    },
}));
