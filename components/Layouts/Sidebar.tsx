import Link from 'next/link';
import Image from 'next/image';
import logoBrand from '@assets/MetaMail.svg';
import logo from '@assets/logo.svg';
import showMore from '@assets/showMore.svg';
import purpleTag from '@assets/purpleTag.svg';
import {add, more} from '@assets/icons';
import compose from '@assets/inbox_compose.svg';
import {MailMenuItems } from '@constants/menu';
//import { FilterTypeEn, MetaMailTypeEn } from '@constants/interfaces';
import React, { useEffect, useState } from 'react';
import Icon from '@components/Icon';
import { useRouter } from 'next/router';
import { disconnect } from '@wagmi/core';
import useStore from '@utils/storage/filter';

export default function Sidebar(props: { setOnCompose: (arg0: boolean) => void; unreadCount: { unread: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | null | undefined; }; }) {
  const setFilter = useStore(state => state.setFilter)
  const filterType = useStore(state => state.filter)
  const [hideDropStatus, setHideDropStatus] = useState(false);
  const [dropStatus, setDropStatus] = useState(false);
  const router = useRouter()
  async function handleReturnHome(){
    router.push('/');
  }
  return (
  <div className='bg-[#F3F7FF] w-200 pl-15 pr-10 pt-12 flex flex-col justify-between font-poppins text-sm '>
    <div className='flex flex-col'>
      <button onClick={handleReturnHome} className='flex flex-row space-x-5'>
          <Image src={logo} alt="logo" className="w-auto h-24 "/>
          <Image src={logoBrand} alt="logo_brand" className="flex self-end pb-4"/>
      </button>
      <button className='my-19 flex h-35 bg-[#006AD4] rounded-5 justify-center gap-20 py-8' onClick={()=>{props.setOnCompose(true)}}>
        <Image src={compose} alt="new_mail" className="w-16 h-auto"/>
        <div className='text-white overflow-hidden'>New Message</div>
      </button>
        <div className=''>
          <ul className="p-2 rounded-box w-full text-[#7F7F7F]">
            {MailMenuItems.map((item,index) => {
            return (
              <li
                key={index}
                className={item.hidden===false?'auto':'hidden'}
                ><button onClick={()=>{setFilter(Number(item.key))}} className={filterType === Number(item.key)? 'w-full hover:bg-[#DAE7FF] px-7 py-6 flex flex-row gap-7 active-bg rounded-5 font-bold':'w-full hover:bg-[#DAE7FF] px-7 py-6 flex flex-row gap-7 rounded-5'}>
                <Image src={item?.logo} alt={item?.title} height="12.5" className='self-center'/>
                <div className=''>
                  <span className=''> {item.title}</span>
                  {item.title === 'Inbox' ? (
                    <span className=''>
                      {props?.unreadCount?.unread}
                    </span>
                  ) : null}
                </div>
                </button>
              </li>
            );
          })}
      <li className='p-9 flex flex-row gap-10 rounded-5 text-[#BDBDBD]'>
      <Icon   
            url={showMore}
            className={dropStatus? 'mt-4 h-12 self-center rotate-90':'mt-4 h-12 self-center'}
            onClick={()=>setDropStatus(dropStatus===false)}/>   
                <div className='flex justify-between w-full '>
                  <span className=''>More</span>
                    <span className=''>2</span>
                </div>
              </li>
        </ul>
      <ul className='text-[#7F7F7F]'>
      {dropStatus?MailMenuItems.map((item,index) => {
            return (
              <li key={index} className={item.hidden?'auto':'hidden'}><Link href={''} className={item.title === 'Inbox'? 'hover:bg-[#DAE7FF] p-7 flex flex-row gap-7 active-bg rounded-5 font-bold':'hover:bg-[#DAE7FF] p-7 flex flex-row gap-7 rounded-5'}>
                <Image src={item?.logo} alt={item?.title} height="12.5"/>
                <div className='pt-3'>
                  <span className=''> {item.title}</span>
                  {item.title === 'Inbox' ? (
                    <span className=''>
                      {props?.unreadCount?.unread}
                    </span>
                  ) : null}
                </div>
                </Link>
              </li>
            );
          }):null}
          </ul>
          <div className='w-177 h-0 border'></div>
          <ul><li className='p-9 flex flex-row gap-10 rounded-5 text-[#707070]'>
      <Icon   
            url={showMore}
            className={hideDropStatus? 'mt-4 h-12 self-center rotate-90':'mt-4 h-12 self-center'}
            onClick={()=>setHideDropStatus(hideDropStatus===false)}/>   
                <div className='flex flex-row justify-between w-full '>
                  <span className=''>Tag</span>
                  <div className='flex flex-row gap-5'>
                    <Image src={add} alt="add"/>
                    <Image src={more} alt="more"/>
                  </div>
                </div>
              </li>
        </ul>
        {hideDropStatus?
        <div>
            <div className='text-[#707070] flex flex-row gap-5 pl-12 pb-13'>
<svg className='self-end pb-[0.5px]' width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.99581 0.550049H7.71581C8.05581 0.550049 8.48082 0.785049 8.66082 1.07505L10.7508 4.41505C10.9508 4.74005 10.9308 5.25005 10.7008 5.55505L8.11083 9.00505C7.92583 9.25005 7.52581 9.45005 7.22081 9.45005H1.99581C1.12081 9.45005 0.59083 8.49005 1.05083 7.74505L2.43581 5.53005C2.62081 5.23505 2.62081 4.75505 2.43581 4.46005L1.05083 2.24505C0.59083 1.51005 1.12581 0.550049 1.99581 0.550049Z" stroke="#8828FF" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>      {//temp
}
                <div className="h-15">
                  <span className='text-xs'>Life</span>
                  <span className=''>{props?.unreadCount?.unread}</span>
                </div>
            </div>
            <div className='text-[#707070] flex flex-row gap-5 pl-12 pb-13'>
<svg className='self-end pb-[0.5px]' width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.99581 0.550049H7.71581C8.05581 0.550049 8.48082 0.785049 8.66082 1.07505L10.7508 4.41505C10.9508 4.74005 10.9308 5.25005 10.7008 5.55505L8.11083 9.00505C7.92583 9.25005 7.52581 9.45005 7.22081 9.45005H1.99581C1.12081 9.45005 0.59083 8.49005 1.05083 7.74505L2.43581 5.53005C2.62081 5.23505 2.62081 4.75505 2.43581 4.46005L1.05083 2.24505C0.59083 1.51005 1.12581 0.550049 1.99581 0.550049Z" stroke="#8828FF" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>      {//temp
}
                <div className="h-15">
                  <span className='text-xs'>Life</span>
                  <span className=''>{props?.unreadCount?.unread}</span>
                </div>
            </div>
            </div>
            :null}
          </div>
    </div>
  </div>
  );
}
