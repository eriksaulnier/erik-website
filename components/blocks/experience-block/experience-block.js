import { motion } from 'framer-motion';
import { companyYears, formatYears } from '@/lib/experience.mjs';
import { useAllowsMotion } from '@/lib/motion-preference';
import styles from './experience-block.module.scss';

const item = {
  initial: { y: 10, opacity: 0 },
  enter: { y: 0, opacity: 1, transition: { staggerChildren: 0.06 } },
  exit: { y: 5, opacity: 0 },
};

const role = {
  initial: { opacity: 0, x: 10 },
  enter: { opacity: 1, x: 0 },
  exit: { opacity: 0 },
};

export default function ExperienceBlock({ data: { title, companies } }) {
  const allowsMotion = useAllowsMotion();

  return (
    <motion.section
      className={styles.experienceBlock}
      variants={{ enter: { transition: { staggerChildren: 0.12 } } }}
    >
      {title && <h2>{title}</h2>}

      <div className={styles.timeline}>
        <motion.span
          className={styles.rail}
          aria-hidden="true"
          variants={{
            initial: { scaleY: 0 },
            enter: {
              scaleY: 1,
              transition: { duration: 0.9, ease: 'easeOut' },
            },
            exit: { opacity: 0 },
          }}
        />

        <ol className={styles.companies}>
          {companies?.map((company, index) => {
            const years = companyYears(company.roles);
            return (
              <motion.li className={styles.company} key={index} variants={item}>
                <span className={styles.companyDot} aria-hidden="true" />
                <div className={styles.row}>
                  <h3>
                    {company.url ? (
                      <a
                        href={company.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {company.name}
                      </a>
                    ) : (
                      company.name
                    )}
                  </h3>
                  <span className={styles.years}>
                    {formatYears(years.start, years.end)}
                  </span>
                </div>

                <ul className={styles.roles}>
                  {company.roles.map((r, roleIndex) => {
                    const current = r.end == null;
                    return (
                      <motion.li
                        className={current ? styles.current : undefined}
                        key={roleIndex}
                        variants={role}
                      >
                        {current && allowsMotion && (
                          <motion.span
                            className={styles.rolePulse}
                            aria-hidden="true"
                            initial={{ opacity: 0, scale: 1 }}
                            animate={{ opacity: [0.5, 0], scale: [1, 2.6] }}
                            transition={{
                              duration: 1.6,
                              ease: 'easeOut',
                              delay: 1.2,
                              repeat: Infinity,
                              repeatDelay: 1.6,
                            }}
                          />
                        )}
                        <span className={styles.roleDot} aria-hidden="true" />
                        <div className={styles.row}>
                          <span className={styles.title}>
                            {r.title}
                            {r.note && (
                              <span className={styles.note}> ({r.note})</span>
                            )}
                          </span>
                          <span className={styles.years}>
                            {formatYears(r.start, r.end)}
                          </span>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </motion.section>
  );
}
