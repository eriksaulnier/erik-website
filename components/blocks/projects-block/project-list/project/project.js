import { Component } from 'react'
import Link from 'next/link'
import TagList from '../../../../tag-list'
import styles from './project.module.scss'

export default class Project extends Component  {  
  constructor(props) {
    super(props)

    this.data = props.data
  }

  onHover() {
    // console.log('hiii')
  }

  render() {
    // console.log(data)
    return (
      <div className={styles.project} onMouseEnter={this.onHover}>
        <div className={styles.container}>

        </div>
        <div className={styles.image}>
          <img alt={this.data.title} src={this.data.thumbnail} />
        </div>

        <div className={styles.content}>
          <div className={styles.heading}>
            <h4 className={styles.title}>{this.data.title}</h4>
            <span className={styles.year}>{this.data.year}</span>
          </div>

          {/* <span className={styles.client}>{this.data.client}</span> */}

          {this.data.stack ? (
            <>
              <h5>Technologies Used</h5>
              <TagList tags={this.data.stack} color={'light-2'} />
            </>
          ) : null}

          {/* <p>{this.data.description}</p> */}

          <div className={styles.links}>
            {this.data.links?.map((item, index) => (
              <Link href={item.link} key={index}>
                <a className="btn">
                  {item.title}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  }
}