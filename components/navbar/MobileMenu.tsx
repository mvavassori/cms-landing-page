"use client";
import { useState } from "react";
import Link from "next/link";
import HamburgerIcon from "../icons/HamburgerIcon";
import CloseIcon from "../icons/CloseIcon";

interface LinkItem {
  id: number;
  href: string;
  label: string;
  isExternal: boolean;
}

interface MobileMenuProps {
  navigation: LinkItem[];
  cta: LinkItem | null;
}

export default function MobileMenu({ navigation, cta }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMobileMenu = () => setIsOpen(!isOpen);
  const closeMobileMenu = () => setIsOpen(false);

  return (
    <div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10"
          onClick={closeMobileMenu}
          aria-hidden="true"
        ></div>
      )}
      <div className="flex w-full">
        <div
          className={`fixed top-0 left-0 bottom-0 w-5/6 max-w-sm bg-white z-20 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out`}
          role="dialog"
          aria-modal="true"
        >
          <div className="mt-12 flex flex-col items-start p-4">
            {navigation?.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-lg block p-2 w-full"
                target={link.isExternal ? "_blank" : undefined}
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}

            {cta && navigation?.length > 0 && (
              <hr className="my-4 w-full border-gray-200" />
            )}

            {cta && (
              <Link
                href={cta.href}
                target={cta.isExternal ? "_blank" : undefined}
                className="text-lg block p-3 w-full font-semibold text-blue-600 hover:bg-blue-50 rounded"
                onClick={closeMobileMenu}
              >
                {cta.label}
              </Link>
            )}
          </div>
        </div>
        <button onClick={toggleMobileMenu} className="z-30">
          {isOpen ? <CloseIcon width={24} height={24} /> : <HamburgerIcon />}
        </button>
      </div>
    </div>
  );
}
