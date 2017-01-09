import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';

export default class LandingPage extends React.Component {
    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <div className="text-left">
                            <h3>Välkommen till betaversionen av Gakusei!</h3>
                            <p>
                                Gakusei är en webbapplikation där du kan öva dig på japanska.
                                Den nuvarande versionen har två spellägen.
                            </p>
                            <p>
                                Det första kallas "Gissa ordet".
                                Där ska man välja rätt översättning på ett ord bland fyra alternativ.
                                Just nu kan man välja spelomgångar indelade efter ordklasser.
                                Vid spel vid dator kan tangenterna 1-4 användas för att välja svarsalternativ.
                            </p>
                            <p>
                                Det andra spelläget kallas för "Översätt ordet".
                                Här gäller det att skriva in rätt översättning på ett ord.
                            </p>
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
};