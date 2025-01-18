# SuperAgentAI Monorepo

This repository contains the source code for the SuperAgentAI project, a platform for creating, managing, and participating in AI-driven missions. It utilizes a monorepo architecture to manage multiple related packages within a single repository, allowing for efficient code sharing and dependency management.

## Project Structure

The project is organised as a monorepo, with all packages located under the `packages` directory.

*   `packages/frontend`: The user interface for the SuperAgentAI platform.
*   `packages/api`: The backend API for the SuperAgentAI platform.
*   `packages/mission`: Core mission management logic and features.
*   `packages/contracts`: Smart contracts used in the platform.
*   `packages/eliza`: Integration with the Eliza autonomous agent framework.
*   `packages/dify`: Integration with the Dify LLM application development platform. [2]

## Key Concepts

*   **Missions**: The SuperAgentAI platform is centered around missions. These are activities that users can propose, vote on, participate in, and complete.Missions can involve various tasks, including integrations with other platforms. Each mission has a defined lifecycle, from proposal to completion or cancellation .
*   **Agents**: The platform integrates with AI agents, including Eliza and those developed with Dify [2, 4]. Agents can be assigned tasks within a mission and can interact with each other and with users.
*   **User Roles**: Users can have different roles within the platform, such as admin, participant, manager, subscriber, and agent. These roles determine the level of access and control a user has over missions.
*  **Authentication**: Clerk is used to manage user authentication and authorization. [7]

## Getting Started

### Prerequisites

*   Node.js (v18+)
*   pnpm (recommended)

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd superagentai
    ```
2.  Install dependencies:

    ```bash
    pnpm install
    ```

### Running the Project

Follow the instructions in the README of each package for starting individual components of the application.

## Contributing

If you'd like to contribute code, please see our Contribution Guide. Also, please consider supporting SuperAgentAI by sharing it on social media and at events and conferences.
