// eslint-disable-next-line no-unused-vars
/* global frontend_global_data */

import 'whatwg-fetch';
import { Grid, Row, Col, ListGroup, ListGroupItem, Panel } from 'react-bootstrap';
import xml2js from 'xml2js';

export default class aboutScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backend_licenses: '',
      frontend_licenses: '',
      license_url: {
        MIT: 'https://opensource.org/licenses/mit-license.php',
        'BSD-3-Clause': 'https://opensource.org/licenses/BSD-3-Clause',
        LGPL: 'https://opensource.org/licenses/LGPL-2.1'
      }
    };
    // debugger;
  }
  componentDidMount() {
    this.fetchBackendLicenses();
    this.fetchFrontendLicenses();
  }

  createFrontendLicenses(licenses) {
    this.setState({
      frontend_licenses: Object.keys(licenses).map(licenseName => (
        <ListGroupItem key={licenseName}>
          Modul: {licenseName.split('@')[0]}
          <br />
          Version: {licenseName.split('@')[1]}
          <br />
          Repository: {licenses[licenseName].repository}
          <br />
          Licens(er):
          <div key={this.state.license_url[licenses[licenseName].licenses] + licenses[licenseName].licenses}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={
                this.state.license_url[licenses[licenseName].licenses] ||
                `http://www.google.com/search?q=${licenses[licenseName].licenses}`
              }
            >
              {licenses[licenseName].licenses}
            </a>
          </div>
        </ListGroupItem>
      ))
    });
  }

  createBackendLicenses(xmldoc) {
    let dep = '';
    xml2js.parseString(xmldoc, (err, result) => {
      dep = result.licenseSummary.dependencies[0].dependency;
      dep.forEach(d => {
        const dependency = Object.assign({}, d);
        if (!d.licenses[0].license) {
          dependency.licenses[0] = {
            license: [
              {
                name: ['No license specified'],
                url: ['']
              }
            ]
          };
        } else if (!d.licenses[0].license[0].url) {
          dependency.licenses[0].license[0] = {
            name: dependency.licenses[0].license[0].name[0],
            url: ''
          };
        }
      });
    });
    const produceLicenses = licenses =>
      licenses.map(l => (
        <div key={l.url[0] + l.name[0]}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={l.url[0]}
          >
            {l.name[0]}
          </a>
        </div>
      ));
    this.setState({
      backend_licenses: dep.map(d => (
        <ListGroupItem key={d.groupId[0] + d.artifactId[0]}>
          Modul: {d.groupId[0]} : {d.artifactId[0]}
          <br />
          Version: {d.version[0]}
          <br />
          Licens(er): {produceLicenses(d.licenses[0].license)}
        </ListGroupItem>
      ))
    });
  }
  fetchBackendLicenses() {
    fetch('license/licenses.xml')
      .then(response => response.text())
      .then(str => new window.DOMParser().parseFromString(str, 'text/xml'))
      .then(xmlobj => new XMLSerializer().serializeToString(xmlobj))
      .then(xmldoc => this.createBackendLicenses(xmldoc));
  }
  fetchFrontendLicenses() {
    fetch('license/frontend_licenses.json')
      .then(response => response.json())
      .then(json => this.createFrontendLicenses(json));
  }
  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <div className="text-left">
                <h2>Om Gakusei</h2>
                <p>
                  Gakusei är en webbapplikation där du kan öva dig på japanska. Applikationen har följande tre
                  spellägen:
                </p>
                <ol>
                  <li>
                    &quot;Gissa ordet&quot; som kan hittas under fliken &quot;Glosor&quot;. Här ska man välja rätt
                    översättning på ett ord bland fyra alternativ.
                  </li>
                  <li>
                    &quot;Översätt ordet&quot; som även det kan hittas under fliken &quot;Glosor&quot;. Här gäller det
                    att skriva in rätt översättning på ett ord.
                  </li>
                  <li>&quot;Quiz&quot; och där man kan spela frågesporter kopplade till Japan.</li>
                </ol>
                <p>
                  Utvecklingen av applikationen sker i form av ett open source-projekt och sponsras utav{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.kits.se"
                  >
                    Kits
                  </a>. Besök gärna projektets{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/kits-ab/gakusei/"
                  >
                    Githubsida.
                  </a>
                </p>
                <p>
                  {' '}
                  Webbappen Gakusei går under licensen{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://opensource.org/licenses/mit-license.php"
                  >
                    MIT
                  </a>. Nedan följer en lista på licenser för de moduler som projektet använder sig av.
                </p>
              </div>
            </Col>
          </Row>
          <Row>
            <Panel
              collapsible
              header="Licenser"
            >
              <ListGroup>
                {this.state.backend_licenses}
                {this.state.frontend_licenses}
              </ListGroup>
            </Panel>
          </Row>
        </Grid>
      </div>
    );
  }
}
