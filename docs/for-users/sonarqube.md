# SonarQube

In order to display the SonarQube dashboard for a project in Backstate, add the following annotation to file `catalog-info.yaml` in your project:

```yaml
metadata:
  annotations:
    sonarqube.org/project-key: <sonar-server-id>/<project-key>
```

where:

* `<sonar-server-id>` is the identifier of the SonarQube instance in the Backstage configuration; it can be found in the [list of SonarQube servers](sonarqube-servers.md);
* `<project-key>` is the value of property `projectKey` in the project configuration file for SonarQube.


## Example

If the URL of a project in SonarQube is `http://sonar2.example.org/dashboard?id=my-project` then:

* the server URL `http://sonar2.example.org` can be used to identify the SonarQube instance `second-cube` in the [list of SonarQube servers](sonarqube-servers.md);
* the project key is `my-project`.

The annotation is `catalog-info.yaml` would be:

```yaml
metadata:
  annotations:
    sonarqube.org/project-key: second-cube/my-project
```
