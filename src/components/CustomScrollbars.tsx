"use client"

import { ReactNode } from "react"
import { Scrollbars } from "react-custom-scrollbars-2"

type CustomScrollBarProps = {
  children: ReactNode;
}

export default function CustomScrollbars({children}:CustomScrollBarProps) {


  return (

    <Scrollbars
      // hideTracksWhenNotNeeded
      thumbMinSize={40}
      renderThumbVertical={props => <div {...props} className="thumb-vertical bg-zinc-100/50 rounded-full relative" />}
    >

      <div className="">

        {children}

      </div>

    </Scrollbars>

  )
}