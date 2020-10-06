import Layout from '../components/layout'
import ProjectList from '../components/project-list'

export default function Projects() {

  const projects = [
    {
      title: 'Pass the Aux',
      year: '2019',
      link: 'http://aux-pass.herokuapp.com',
    }, {
      title: 'Tech Valley Digital Gaming Hub',
      year: '2017',
      link: 'http://gamehub.rpi.edu/',
      description: "Worked with Rensselaer Polytechnic Institute's GSAS department to design/develop a custom WordPress theme and plugins for the school's Digital Gaming Hub website. The Digital Gaming Hub's main goal is to bring together higher education, industry, and community partners to support and grow the digital gaming ecosystem centered on the Tech Valley and Capital District regions in New York State.",
    }, {
      title: 'Sneaky Spanish',
      year: '2015',
      link: 'https://chrome.google.com/webstore/detail/sneaky-spanish/fmbgmlhpadiloggofeliagghggmopgbk',
      description: "Sneaky Spanish is a Chrome extension that allows you to learn Spanish in the context of web pages you are already reading on the web by selectively translating words on the pages you view. I served as one of the main developers for the initial development of the extension."
    }, {
      title: 'Lorem ipsum dolor',
      year: '2015',
    }, {
      title: 'Aliquam tincidunt mauris',
      year: '2015',
    }
  ];

  return (
    <Layout pageTitle="Projects">
      <div className="container mx-auto">
        <h1>Some Projects</h1>

        <ProjectList projects={projects} />
      </div>
    </Layout>
  )
}
