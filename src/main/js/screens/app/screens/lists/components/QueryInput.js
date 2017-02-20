import React from 'react';
import { Button, FormGroup, Checkbox, FormControl, ControlLabel } from 'react-bootstrap';

const QueryInput = props =>
  <form href="#" onSubmit={props.handleSubmit}>
    <FormGroup>
      <ControlLabel>Filtrera ord på:</ControlLabel>
      <FormControl componentClass="select" id="wordType" onChange={props.handleChange}>
        <option value="">
          Alla ordtyper
        </option>
        <option value="verb">
          Verb
        </option>
        <option value="adjective">
          Adjektiv
        </option>
        <option value="noun">
          Substantiv
        </option>
        <option value="adverb">
          Adverb
        </option>
      </FormControl>
      <br />
      <ControlLabel>Markera de översättningar ordet ska ha
        (om inget alternativ är markerat listas alla ord):
      </ControlLabel>
      <br />
      <Checkbox id="kanjiFactType" inline onChange={props.handleChange}>
        Kanji
      </Checkbox>
      <br />
      <Checkbox id="readingFactType" inline onChange={props.handleChange}>
        Japansk läsform
      </Checkbox>
      <br />
      <Checkbox id="writingFactType" inline onChange={props.handleChange}>
        Japansk skrivform
      </Checkbox>
      <br />
      <Checkbox id="swedishFactType" inline onChange={props.handleChange}>
        Svenska
      </Checkbox>
    </FormGroup>
    <Button type="submit">
      Filtrera
    </Button>
  </form>;

QueryInput.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
  handleChange: React.PropTypes.func.isRequired
};

export default QueryInput;
