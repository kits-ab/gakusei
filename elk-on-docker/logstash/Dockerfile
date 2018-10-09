ARG ELK_VERSION

# https://github.com/elastic/logstash-docker
FROM docker.elastic.co/logstash/logstash-oss:${ELK_VERSION}

# Add your logstash plugins setup here
# Example: RUN logstash-plugin install logstash-filter-json

# Install the logstash input jdbc plugin to work with postgres.
RUN logstash-plugin install logstash-input-jdbc

# Copy files from the host machine to the container. The syntax is 'COPY <source> <target>'.
COPY /pipeline/gakusei_events.conf /usr/share/logstash/pipeline/
COPY /pipeline/gakusei_progresstrackinglist.conf /usr/share/logstash/pipeline/
COPY postgresql-42.2.5.jar /usr/share/logstash/

# Commands to run on logstash startup.

#CMD ["-f", "/usr/share/logstash/pipeline/gakusei_progresstrackinglist.conf"]
#CMD ["-f", "/usr/share/logstash/pipeline/gakusei_events.conf"]