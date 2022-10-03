# SonarQube

The configuration of SonarQube goes to `app-config.yaml`:

```yaml
sonarqube:
  instances:
    - name: <instance-name>
      baseUrl: <instance-url>
      apiKey: <instance-api-key>
```

Describe all SonarQube instances inside the organization.


## Example

```yaml
sonarqube:
  instances:
    - name: first-cube
      baseUrl: http://sonar1.example.org
      apiKey: ${SONAR_FIRST_CUBE_API_KEY}
```

The API key must identify a user that has at least read access to all projects hosted by that SonarQube instance.
Its actual value can be stored either in `app-config.local.yaml` or, even better, it can be injected in the process environment at startup.
