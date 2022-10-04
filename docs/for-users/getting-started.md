# How to prepare a software project to be added to Backstage software catalog

In order to be included in the Backstage software catalog, each project needs to provide a descriptor file named `catalog-info.yaml` in its root directory.<br>
This file describes the project, its APIs, resources, relations with other entities (projects, APIs, resources), documentation, integration with CI/CD systems etc.

The descriptor file must be persisted in the project repository together with the project code files.


## Example descriptor file

A minimal descriptor file for a project looks like this:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: artist-web
spec:
  type: website
  lifecycle: production
  owner: artist-relations-team
```

All the properties in the example above are required.

Usually, a descriptor file also contains some optional properties to describe the project better:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: artist-web
  description: The place to be, for great artists
  labels:
    example.com/custom: custom_label_value
  annotations:
    example.com/service-discovery: artistweb
    circleci.com/project-slug: github/example-org/artist-website
  tags:
    - java
  links:
    - url: https://admin.example-org.com
      title: Admin Dashboard
      icon: dashboard
      type: admin-dashboard
spec:
  type: website
  lifecycle: production
  owner: artist-relations-team
  system: public-websites
```


The structure of the entity descriptor file, the properties and their usage, the format and restrictions on the values are described in [Backstage documentation](https://backstage.io/docs/features/software-catalog/descriptor-format#kind-component).
