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
    <nav className={styles.Header}>
      <div className={styles.Container}>

        <div className={styles.Left}>
          <Link href="/">
            <a className={styles.Brand}>{siteTitle}</a>
          </Link>

          <div className={styles.Navigation}>
            {navigation ? navigation.map((page, index) => (
              <Link key={index} href={'/'+page.slug}>
                <a className={(isActive(page.slug) ? styles.active : '')}>
                  {page.label}
                </a>
              </Link>
            )) : null}
          </div>
        </div>

        <div className={styles.Social}>
          {social_links ? social_links.map((item, index) => (
            <Link key={index} href={item.link}>
              <a title={item.title} target="_blank" rel="noopener">
                {item.icon ? React.createElement(Fa[item.icon]) : null}
              </a>
            </Link>
          )) : null}
        </div>
      </div>
    </nav>
  )
}