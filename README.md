# Dashboard for EMQX 5.0

EMQX Dashboard is a built-in management console for EMQX. It enables users to effortlessly manage and monitor EMQX clusters, configure required features, and visualize data through a web interface.

![image](./assets/overview.png)

## Key Features

- Data monitoring and management: clear overview of important data

- Visual access control management: out-of-the-box authentication and authorization

- Robust data integration capabilities: flow editor and bi-directional data bridge

- Real-time configuration updates: hot updates with immediate configuration saving

- Customizable extension capabilities: built-in gateways, plugins, and Hooks

- Comprehensive diagnostic tools: timely problem identification and resolution

## Running

First, install the latest version of [EMQX](https://www.emqx.com/en/try?product=broker).

Upon successful EMQX installation, access and use the EMQX Dashboard by opening <http://localhost:18083/> (replace localhost with the actual IP address if deployed on a non-local machine) in your browser. By default, EMQX Dashboard listens on port 18083 as a web application.

> "Note that EMQX can still function without the Dashboard enabled. The Dashboard merely offers a visual interface for users".

## Get Involved

- Follow [@EMQTech on Twitter](https://twitter.com/EMQTech).
- If you have a specific question, check out our [discussion forums](https://github.com/emqx/emqx/discussions).
- For general discussions, join us on the [official Discord](https://discord.gg/xYGf3fQnES) team.
- Keep updated on [EMQX YouTube](https://www.youtube.com/channel/UC5FjR77ErAxvZENEWzQaO5Q) by subscribing.

## Resources

- [MQTT client programming](https://www.emqx.com/en/blog/tag/mqtt-client-programming)

  A collection of blog posts to help developers quickly learn MQTT in PHP, Node.js, Python, Golang, and other programming languages.

- [MQTT SDKs](https://www.emqx.com/en/mqtt-client-sdk)

  Explore popular MQTT client SDKs in various programming languages, complete with code examples to facilitate a better understanding of MQTT clients.

- [MQTT X](https://mqttx.app/)

  An elegant cross-platform MQTT 5.0 client tool that provides desktop, command line, and web to help you develop and debug MQTT services and applications faster.

- [Internet of Vehicles](https://www.emqx.com/en/blog/category/internet-of-vehicles)

  Build a reliable, efficient, and industry-specific IoV platform based on EMQ's practical experience, from protocol selection to platform architecture design.

## Local Development

To set up the project for local development, follow these steps:

1. Fork the repository and clone your fork:

    ```shell
    git clone https://github.com/your-username/emqx-dashboard5.git
    cd emqx-dashboard5
    ```

    Alternatively, you can clone the original repository directly:

    ```shell
    git clone https://github.com/emqx/emqx-dashboard5.git
    cd emqx-dashboard5
    ```

2. Install the dependencies:

    ```shell
    yarn
    ```

3. Run the following command to start the development server:

    ```shell
    yarn serve
    ```

4. Compile and minify for production:

    ```shell
    yarn build
    ```

5. Lint and fix files:

    ```shell
    yarn lint
    ```

    or Format code with Prettier:

    ```shell
    yarn format
    ```

### Development with Cloud Host

To compile and hot-reload for development with a cloud host, follow these steps:

1. Create a `.env.cloud` file in the root directory with the following content:

    ```shell
    HOST_URL=http://your-cloud-host:port/
    ```

2. Run the following command:

    ```shell
    yarn serve:cloud
    ```

## Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

The CI will then run automatically, and it will be released after the run is complete.
