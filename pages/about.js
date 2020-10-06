import Link from 'next/link'
import React from 'react'
import { Client } from '../prismic-configuration'
import { RichText } from 'prismic-reactjs'
import Layout from '../components/layout'
import SkillsBlock from '../components/skills-block'
import { loadGetInitialProps } from 'next/dist/next-server/lib/utils';

export default class extends React.Component {
  static async getInitialProps(context) {
    const req = context.req
    const doc = await Client(req).getSingle('about')

    return { doc }
  }

  renderSection(section) {
    console.log(section.items);
    switch (section.slice_type) {
      case 'content_block': {
        return (
          <section>
            <h2>{RichText.asText(section.primary.title)}</h2>
            <RichText render={section.primary.text} />
          </section>
        )
      }
      case 'skills_block': {
        return (
          <section>
            <h2>{RichText.asText(section.primary.title)}</h2>
            {section.items.map(item => (
              <SkillsBlock 
                title={RichText.asText(item.title)}
                skills={RichText.asText(item.skills).split(',')}
              />
            ))}
          </section>
        )
      }
    }
  }

  render() {
    console.log(this.props.doc);
    return (
      <Layout pageTitle = "About" >
        <div className="container mx-auto">
          <h1>About Me</h1>

          <section>
            <RichText render={this.props.doc?.data?.content} />
          </section>

          {this.props.doc?.data?.body ? this.props.doc.data.body.map(section => this.renderSection(section)) : null}
          {/* <section>
            <h3>Hello, my name is Erik!</h3>
            <p>I’m a software engineer based in upstate New York who loves turning ideas into code. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.
            Donec nec justo eget felis facilisis fermentum. Aliquam porttitor mauris sit amet orci. Aenean dignissim pellentesque felis.</p>
            <p>I currently work full-time as a developer at <Link href="https://troyweb.com"><a>Troy Web Consulting</a></Link> in Troy, NY.</p>
          </section>
  
          <section>
            <h2>Technologies I Use</h2>
            {technologies.map(block => (
              <SkillsBlock key={block.title} title={block.title} skills={block.skills} />
            ))}
          </section>
  
          <section>
            <h2>Get in Contact</h2>
            <p>If you'd like to work together on a project, have a technical question, or just want to have a chat; feel free to get in touch with me <Link href="/contact"><a>using this form</a></Link>.</p>
          </section> */}
        </div>
      </Layout>
    )
  }
}
