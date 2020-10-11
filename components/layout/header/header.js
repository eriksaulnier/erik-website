import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as Fa from 'react-icons/fa' 
import styles from './header.module.scss'

export default function Header({ siteTitle, navigation, social_links }) {
  const router = useRouter();

  function isActive(slug) {
    return router.asPath === `/${slug}`;
  }

  return (
    <nav className={styles.header}>
      <div className={styles.container}>

        <div className={styles.left}>
          <Link href="/">
            <a className={styles.brand}>{siteTitle}</a>
          </Link>

          <div className={styles.navigation}>
            {navigation ? navigation.map((page, index) => (
              <Link key={index} href={'/'+page.slug}>
                <a className={(isActive(page.slug) ? styles.active : '')}>
                  {page.label}
                </a>
              </Link>
            )) : null}
          </div>
        </div>

        <div className={styles.social}>
          {social_links ? social_links.map((item, index) => (
            <Link key={index} href={item.link}>
              <a title={item.title}>
                {item.icon ? React.createElement(Fa[item.icon]) : null}
              </a>
            </Link>
          )) : null}
        </div>
      </div>
    </nav>
  )
}