import React from 'react';
import {Button, FormGroup,
        Checkbox, FormControl, ControlLabel} from 'react-bootstrap';

export default class QueryInput extends React.Component{
    render() {
        return(
            <form href='#' onSubmit={this.props.handleSubmit}>
                <FormGroup>
                    <ControlLabel>Filtrera nuggets på:</ControlLabel>
                    <FormControl componentClass='select' id='wordType'
                    onChange={this.props.handleChange}>
                        <option value=''>
                            Alla ordtyper
                        </option>
                        <option value='verb'>
                            Verb
                        </option>
                        <option value='adjective'>
                            Adjektiv
                        </option>
                        <option value='noun'>
                            Substantiv
                        </option>
                        <option value='adverb'>
                            Adverb
                        </option>
                    </FormControl>
                    Nuggeten ska innehålla översättningar från följande språk:
                    <br/>
                    <Checkbox id='kanjiFactType' inline onChange={this.props.handleChange}>
                        Kanji
                    </Checkbox>
                    {' '}
                    <Checkbox id='readingFactType' inline onChange={this.props.handleChange}>
                        Japansk läsform
                    </Checkbox>
                    {' '}
                    <Checkbox  id='writingFactType' inline onChange={this.props.handleChange}>
                        Japansk skrivform
                    </Checkbox>
                    {' '}
                    <Checkbox id='englishFactType' inline onChange={this.props.handleChange}>
                        Engelska
                    </Checkbox>
                </FormGroup>
                <Button type='submit'>
                    Filtrera
                </Button>
            </form>
        )
    }
}