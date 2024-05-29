/**
 * Copyright 2013-2024 the original author or authors from the Trinity Platform project.
 *
 * This file is part of the Trinity Platform project, see https://www.trinity-technology.com/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import BaseApplicationGenerator from '../../../base-application/index.js';

export default class JibGenerator extends BaseApplicationGenerator {
  async beforeQueue() {
    if (!this.fromBlueprint) {
      await this.composeWithBlueprints();
    }

    if (!this.delegateToBlueprint) {
      await this.dependsOnBootstrapApplication();
      await this.dependsOnJHipster('maven');
    }
  }

  get initializing() {
    return this.asInitializingTaskGroup({
      async parseCommand() {
        await this.parseCurrentJHipsterCommand();
      },
    });
  }

  get [BaseApplicationGenerator.INITIALIZING]() {
    return this.delegateTasksToBlueprint(() => this.initializing);
  }

  get prompting() {
    return this.asPromptingTaskGroup({
      async promptCommand({ control }) {
        if (control.existingProject && this.options.askAnswered !== true) return;
        await this.promptCurrentJHipsterCommand();
      },
    });
  }

  get [BaseApplicationGenerator.PROMPTING]() {
    return this.delegateTasksToBlueprint(() => this.prompting);
  }

  get loading() {
    return this.asLoadingTaskGroup({
      async loadConfig({ application }) {
        await this.loadCurrentJHipsterCommandConfig(application);
      },
    });
  }

  get [BaseApplicationGenerator.LOADING]() {
    return this.delegateTasksToBlueprint(() => this.loading);
  }

  get postWriting() {
    return this.asPostWritingTaskGroup({
      addJibPlugin({ application, source }) {
        const { baseName, serverPort, javaDependencies, dockerContainers, dockerServicesDir } = application;
        const { cacheProviderHazelcast, cacheProviderInfinispan } = application as any;
        source.addMavenDefinition?.({
          properties: [
            { property: 'jib-maven-plugin.version', value: javaDependencies!['jib-maven-plugin'] },
            { property: 'jib-maven-plugin.image', value: dockerContainers!.javaJre },
            { property: 'jib-maven-plugin.architecture', value: 'amd64' },
          ],
          plugins: [{ groupId: 'com.google.cloud.tools', artifactId: 'jib-maven-plugin' }],
          pluginManagement: [
            {
              groupId: 'com.google.cloud.tools',
              artifactId: 'jib-maven-plugin',
              // eslint-disable-next-line no-template-curly-in-string
              version: '${jib-maven-plugin.version}',
              additionalContent: `<configuration>
    <from>
        <image>\${jib-maven-plugin.image}</image>
        <platforms>
            <platform>
                <architecture>\${jib-maven-plugin.architecture}</architecture>
                <os>linux</os>
            </platform>
        </platforms>
    </from>
    <to>
        <image>${baseName.toLowerCase()}:latest</image>
    </to>
    <container>
        <entrypoint>
            <shell>bash</shell>
            <option>-c</option>
            <arg>/entrypoint.sh</arg>
        </entrypoint>
        <ports>
            <port>${serverPort}</port>${
              cacheProviderHazelcast
                ? `
            <port>5701/udp</port>
`
                : ''
            }
        </ports>
        <environment>${
          cacheProviderInfinispan
            ? `
            <JAVA_OPTS>-Djgroups.tcp.address=NON_LOOPBACK -Djava.net.preferIPv4Stack=true</JAVA_OPTS>
`
            : ''
        }
            <SPRING_OUTPUT_ANSI_ENABLED>ALWAYS</SPRING_OUTPUT_ANSI_ENABLED>
            <JHIPSTER_SLEEP>0</JHIPSTER_SLEEP>
        </environment>
        <creationTime>USE_CURRENT_TIMESTAMP</creationTime>
        <user>1000</user>
    </container>
    <extraDirectories>
        <paths>${dockerServicesDir}jib</paths>
        <permissions>
            <permission>
                <file>/entrypoint.sh</file>
                <mode>755</mode>
            </permission>
        </permissions>
    </extraDirectories>
</configuration>`,
            },
          ],
        });
      },
    });
  }

  get [BaseApplicationGenerator.POST_WRITING]() {
    return this.delegateTasksToBlueprint(() => this.postWriting);
  }
}
