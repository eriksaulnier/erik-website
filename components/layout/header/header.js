import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as Fa from 'react-icons/fa' 
import { motion, AnimatePresence } from 'framer-motion'
import styles from './header.module.scss'

export default function Header({ siteTitle, navigation, social_links }) {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [navigating, setNavigating] = useState(false)
  const [currentPath, setCurrentPath] = useState(router.asPath)
  const [resetTimeout, setResetTimeout] = useState(null)

  // Set up route change listeners
  useEffect(() => {
    const routeChangeStart = () => {
      setNavigating(true)
    }
    router.events.on('routeChangeStart', routeChangeStart)

    const routeChangeComplete = (path) => {
      setCurrentPath(path)
      setNavigating(false)
    }
    router.events.on('routeChangeComplete', routeChangeComplete)

    return () => {
      router.events.off('routeChangeStart', routeChangeStart)
      router.events.off('routeChangeComplete', routeChangeComplete)
    }
  }, [])

  // Prevent scrolling when the menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      window.scrollTo(0, 0)
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [open])

  function onMenuMouseEnter(path) {
    if (!navigating) {
      setCurrentPath(path)
      clearTimeout(resetTimeout)
    }
  }

  function onMenuMouseLeave() {
    if (!navigating) {
      setResetTimeout(setTimeout(() => {
        setCurrentPath(router.asPath)
      }, 600))
    }
  }

  const activeMenuItem = navigation.find(page => `/${page.slug}` === currentPath)

  const menuVariants = {
    open: {
      display: 'flex',
      opacity: 1,
      transition: {
        type: 'linear',
        duration: 0.3
      }
    },
    closed: {
      opacity: 0,
      transition: {
        type: 'linear',
        duration: 0.3
      },
      transitionEnd: {
        display: 'none'
      }
    }
  }

  return (
    <nav className={styles.header}>
      <div className={styles.container}>
        <nav className={[styles.navigation, open && styles.active].join(' ')}>
          <Link href="/">
            <a
              className={styles.brand}
              onMouseEnter={() => onMenuMouseEnter('/')}
              onMouseLeave={onMenuMouseLeave}
            >
              {siteTitle}
              {MenuHighlight(currentPath === '/' || !activeMenuItem)}
            </a>
          </Link>

          <motion.button
            initial={false}
            animate={open ? 'open' : 'closed'}
            className={styles.menuToggle}
            onClick={() => setOpen(!open)}
          >
            <svg viewBox="0 0 20 20">
              <Path
                variants={{
                  closed: { d: "M 2 2.5 L 20 2.5" },
                  open: { d: "M 3 16.5 L 17 2.5" }
                }}
              />
              <Path
                d="M 2 9.423 L 20 9.423"
                variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
                transition={{ duration: 0.1 }}
              />
              <Path
                variants={{
                  closed: { d: "M 2 16.346 L 20 16.346" },
                  open: { d: "M 3 2.5 L 17 16.346" }
                }}
              />
            </svg>
          </motion.button>
          
          <motion.div 
            initial={false}
            animate={open ? 'open' : 'closed'}
            variants={menuVariants}
            transition={{ ease: 'linear' }}
            className={styles.menu}
          >
            <div className={styles.menuItems}>
              {navigation && navigation.map((page, index) => (
                <div key={index} className={styles.menuItem}>
                  <Link href={'/[...slug]'} as={`/${page.slug}`}>
                    <a
                      onMouseEnter={() => onMenuMouseEnter(`/${page.slug}`)}
                      onMouseLeave={onMenuMouseLeave}
                    >
                      {page.label}
                      {MenuHighlight(currentPath === `/${page.slug}`)}
                    </a>
                  </Link>
                </div>
              ))}
            </div>
            
            <div className={styles.social}>
              {social_links ? social_links.map((item, index) => (
                <div key={index} className={styles.socialIcon}>
                  <Link href={item.link}>
                    <a target="_blank" rel="noopener">
                      <span className="sr-only">{item.name}</span>
                      {item.icon ? React.createElement(Fa[item.icon]) : null}
                    </a>
                  </Link>
                </div>
              )) : null}
            </div>
          </motion.div>
        </nav>
      </div>
    </nav>
  )
}

const MenuHighlight = (condition)  => condition && (
  <motion.span 
    layoutId="header-highlight"
    className={styles.highlight}
    transition={{
      type: 'spring',
      stiffness: 250,
      damping: 30
    }}
  />
)

const Path = (props) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
)
