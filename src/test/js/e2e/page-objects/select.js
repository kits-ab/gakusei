// enhanced page object

module.exports = {
  // can be string or function
  url() {
    return `${this.api.launchUrl}/select/${this.props.defaultPage}`;
  },

  elements: {
    lessonItems: 'button.list-group-item',
    firstLessonItem: 'button.list-group-item:first-of-type',
    submitButton: 'button[type="submit"]'
  },

  props: {
    defaultPage: 'guess'
  },

  commands: [
    {
      clickFirstLesson() {
        this.waitForElementVisible('@lessonItems')
          .click('@firstLessonItem');
        return this;
      },
      clickRandomLesson() {
        this.waitForElementVisible('@lessonItems');
        this.api.elements('css selector', this.elements.lessonItems.selector, (foundElements) => {
          this.api.elementIdClick(foundElements.value[Math.floor(Math.random() * foundElements.value.length)].ELEMENT);
        });
        return this;
      },
      start() {
        this.click('@submitButton');
        return this;
      }
    }
  ]
};
