# SonarQube servers in the organization

The following SonarQube servers are configured in Backstage:

<table><tbody>
<tr><th>Server ID</th><th>Server URL</th></tr>
<tr><td>first-cube</td><td>http://sonar1.example.org</td></tr>
<tr><td>second-cube</td><td>http://sonar2.example.org</td></tr>
</tbody></table>

Identify the server by its url and use its ID in the
`sonarqube.org/project-key` annotation in the `catalog-info.yaml` file.
