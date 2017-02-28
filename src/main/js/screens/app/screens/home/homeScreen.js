import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

const homeScreen = () =>
  <Grid>
    <Row>
      <Col xs={12}>
        <div className="text-left">
          <h3>Välkommen till Gakusei!</h3>
          <p>
            Gakusei är en webbapplikation där du kan öva dig på japanska.
            Applikationen har följande tre spellägen:
          </p>
          <p>
            &quot;Gissa ordet&quot; som kan hittas under fliken &quot;Glosor&quot;.
            Här ska man välja rätt översättning på ett ord bland fyra alternativ.
            Vid spel vid dator kan tangenterna 1-4 användas för att välja svarsalternativ.
          </p>
          <p>
            &quot;Översätt ordet&quot; som även det kan hittas under fliken &quot;Glosor&quot;.
            Här gäller det att skriva in rätt översättning på ett ord.
          </p>
          <p>
            Det tredje spelläget kallas för &quot;Quiz&quot; och där man kan spela
            frågesporter kopplade till Japan.
          </p>
        </div>
      </Col>
    </Row>
  </Grid>;

export default homeScreen;

