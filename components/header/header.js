import React from 'react';
import Link from 'next/link'
import { useRouter } from "next/router"
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import styles from './header.module.scss'

export default function Header() {
  const router = useRouter();

  function isActive(slug) {
    return router.pathname === `/${slug}`;
  }

  return (
    <nav className={styles.header}>
      <div className={styles.container}>

        <div className={styles.left}>
          <Link href="/">
            <a className={styles.brand}>Erik Saulnier</a>
          </Link>

          <div className={styles.navigation}>
            <Link href="/">
              <a className={(isActive('') ? styles.active : '')}>
                Home
              </a>
            </Link>
            <Link href="/about">
              <a className={(isActive('about') ? styles.active : '')}>
                About
              </a>
            </Link>
            <Link href="/projects">
              <a className={(isActive('projects') ? styles.active : '')}>
                Projects
              </a>
            </Link>
          </div>
        </div>

        <div className={styles.social}>
          <Link href="https://www.linkedin.com/in/eriksaulnier">
            <a>
              <FaLinkedin title="LinkedIn" />
            </a>
          </Link>
          <Link href="https://github.com/eriksaulnier">
            <a>
              <FaGithub title="GitHub" />
            </a>
          </Link>
          <Link href="https://twitter.com/eriksaulnier">
            <a>
              <FaTwitter title="Twitter" />
            </a>
          </Link>
        </div>
      </div>
    </nav>
  )
}