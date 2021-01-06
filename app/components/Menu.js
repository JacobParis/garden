import * as React from 'react'

import Transition from './Transition'
import FocusTrap from './FocusTrap'

export default function Menu({
  sidebarChildren = null,
  headerChildren = null,
  children,
  isStatic,
  isClosed,
  setClosed,
}) {
  return (
    <div className="flex bg-white">
      <Transition
        show={isStatic || !isClosed}
        enter="transition-all duration-500"
        enterFrom="-ml-64"
        enterTo="ml-0"
        leave="transition-all duration-500"
        leaveTo="-ml-64"
      >
        <aside
          className={`z-20 bg-white w-64 min-h-screen flex flex-col ${
            isStatic ? '' : 'fixed'
          }`}
        >
          <FocusTrap isActive={!isStatic}>
            <div className="flex items-center justify-between h-10 px-4 bg-white border-b border-r">
              <a href="/" className="py-2 text-blue">
                Jacob Paris
              </a>

              {!isStatic && (
                <button
                  className="w-10 p-1"
                  aria-label="Close menu"
                  title="Close menu"
                  onClick={() => setClosed(true)}
                >
                  <svg
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              )}
            </div>

            {sidebarChildren}
          </FocusTrap>
        </aside>
      </Transition>

      <Transition
        appear={true}
        show={!isStatic && !isClosed}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-50"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-50"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black opacity-0" />
      </Transition>

      <main className="flex flex-col flex-grow min-h-screen">
        <header className="flex items-center h-10">
          {!isStatic && (
            <button
              tabIndex="1"
              aria-hidden={!isClosed}
              className="w-10 p-1"
              aria-label="Open menu"
              title="Open menu"
              onClick={() => setClosed(false)}
            >
              <svg
                aria-hidden="true"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          )}
          {headerChildren}
        </header>
        {children}
      </main>
    </div>
  )
}
