import React from 'react';
import { Grid, Row, Col, ListGroup, ListGroupItem, Panel } from 'react-bootstrap';
import xml2js from 'xml2js';

export default class AboutPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backend_licenses: '',
      frontend_licenses: '',
      license_url: {
        MIT: 'https://opensource.org/licenses/mit-license.php',
        'BSD-3-Clause': 'https://opensource.org/licenses/BSD-3-Clause',
        LGPL: 'https://opensource.org/licenses/LGPL-2.1'
      },
      frontend_data: [
        { name: 'babel-preset-stage-2',
          version: '6.18.0',
          license: 'MIT'
        },
        { name: 'babel-preset-react',
          version: '6.16.0',
          license: 'MIT'
        },
        { name: 'babel-preset-es2015',
          version: '6.18.0',
          license: 'MIT'
        },
        { name: 'babelify',
          version: '7.2.0',
          license: 'MIT'
        },
        { name: 'whatwg-fetch',
          version: '2.0.1',
          license: 'MIT'
        },
        { name: 'react-dom',
          version: '15.4.1',
          license: 'BSD-3-Clause'
        },
        { name: 'react',
          version: '15.4.1',
          license: 'BSD-3-Clause'
        },
        { name: 'xml2js',
          version: '0.4.17',
          license: 'MIT'
        },
        { name: 'react-bootstrap',
          version: '0.30.7',
          license: 'MIT'
        },
        { name: 'browserify',
          version: '13.1.1',
          license: 'MIT'
        },
        { name: 'hypher',
          version: '0.2.5',
          license: 'BSD-3-Clause'
        },
        { name: 'hyphenation.sv',
          version: '0.2.1',
          license: 'LGPL'
        }
      ]
    };
  }
  componentDidMount() {
    this.fetchBackendLicenses();
    this.setFrontendLicenses();
  }
  setFrontendLicenses() {
    this.setState({ frontend_licenses: this.state.frontend_data.map(d =>
      <ListGroupItem key={d.name + d.version}>
        Modul: {d.name}
        <br />
        Version: {d.version}
        <br />
        Licens(er):
        <div key={this.state.license_url[d.license] + d.license}>
          <a target="_blank" rel="noopener noreferrer" href={this.state.license_url[d.license]}>
            {d.license}
          </a>
        </div>
      </ListGroupItem>)
    });
  }
  createBackendLicenses(xmldoc) {
    let dep = '';
    xml2js.parseString(xmldoc, (err, result) => {
      dep = result.licenseSummary.dependencies[0].dependency;
      dep.forEach((d) => {
        if (!d.licenses[0].license) {
          d.licenses[0] = {
            license: [{
              name: ['No license specified'],
              url: ['']
            }]
          };
        } else if (!d.licenses[0].license[0].url) {
          d.licenses[0].license[0] = {
            name: d.licenses[0].license[0].name[0],
            url: ''
          };
        }
      });
    });
    const produceLicenses = licenses => licenses.map(l =>
      <div key={l.url[0] + l.name[0]}>
        <a target="_blank" rel="noopener noreferrer" href={l.url[0]}>{l.name[0]}</a>
      </div>
    );
    this.setState({ backend_licenses: dep.map(d =>
      <ListGroupItem key={d.groupId[0] + d.artifactId[0]}>
        Modul: {d.groupId[0]} : {d.artifactId[0]}
        <br />
        Version: {d.version[0]}
        <br />
        Licens(er): {produceLicenses(d.licenses[0].license)}
      </ListGroupItem>)
    });
  }
  fetchBackendLicenses() {
    fetch('license/licenses.xml')
      .then(response => response.text())
      .then(str => (new window.DOMParser()).parseFromString(str, 'text/xml'))
      .then(xmlobj => new XMLSerializer().serializeToString(xmlobj))
      .then(xmldoc => this.createBackendLicenses(xmldoc))
      .catch(ex => console.log('Fel vid hämtning av backend-licenser', ex));
  }
  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <h2>Om Gakusei</h2>
              <div>
                <p> Gakusei är en webbapp för övning/inlärning av japanska.
                  Utvecklingen sker i form av ett open source-projekt.
                  Utvecklingen har sponsrats av
                  <a target="_blank" rel="noopener noreferrer" href="https://www.kits.se"> Kits</a>.
                  Besök gärna projektets
                  <a target="_blank" rel="noopener noreferrer" href="https://github.com/kits-ab/gakusei/">
                    Githubsida.
                  </a>
                </p>
              </div>
              <div>
                <p> Webbappen Gakusei går under licensen
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.opensource.org/licenses/mit-license.php"
                  >
                    MIT
                  </a>.
                  Nedan följer en lista på licenser för de moduler som projektet använder sig av.
                </p>
              </div>
              <Panel collapsible header="Licenser">
                <ListGroup>
                  {this.state.backend_licenses}
                  {this.state.frontend_licenses}
                </ListGroup>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
