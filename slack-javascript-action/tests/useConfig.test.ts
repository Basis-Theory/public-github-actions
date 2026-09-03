import useConfig, { GithubContextType } from "../src/useConfig";
import { jest } from "@jest/globals";
import * as core from "@actions/core";
jest.mock("@actions/core");
const mockedCore = core as jest.Mocked<typeof core>;

const mockGetInput = (data: any) => {
  mockedCore.getInput.mockClear();
  mockedCore.getInput.mockImplementation(
    (input: string | undefined = ""): any => data[input]
  );
};

let githubData: GithubContextType = {
  repository: "testing",
  run_id: "12",
  server_url: "http://test-repo.com",
  sha: "1234561234567890",
  actor: "drewsue",
  event: {
    commits: [
      {
        message: "test commit 1",
      },
      {
        message: "test commit 2",
      },
    ],
    repository: {
      name: "test-repo",
    },
    release: {
      tag_name: "v42.0.0",
      author: {
        login: "luvi",
      },
      body: "notes!",
    },
  },
};

const coreData: { [key: string]: any } = {
  github: JSON.stringify(githubData),
  status: "done",
  channel: "C1234567890",
  "mention-person": "drewsue",
};

beforeEach(() => {
  process.env.SLACK_MESSAGE_ID = "1234567890";
  process.env.job_status = "success";
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2020, 3, 1));
});

afterEach(() => {
  delete process.env.SLACK_MESSAGE_ID;
  delete process.env.job_status;
  jest.useRealTimers();
});

describe("happy path", () => {
  beforeEach(() => {
    mockGetInput(coreData);
  });

  test("should return the expected config", () => {
    expect(useConfig()).toMatchSnapshot();
  });
});

describe("no release", () => {
  beforeEach(() => {
    const localMockData = { ...githubData };
    delete localMockData.event.release;

    mockGetInput({ ...coreData, github: JSON.stringify(localMockData) });
  });

  test("should return the expected config", () => {
    expect(useConfig()).toMatchSnapshot();
  });
});

describe("release created by github", () => {
  beforeEach(() => {
    const localMockData = { ...githubData };
    if (localMockData.event.release) {
      localMockData.event.release.author.login = "github-actions[bot]";
    }

    mockGetInput({ ...coreData, github: JSON.stringify(localMockData) });
  });

  test("should return the expected config", () => {
    expect(useConfig()).toMatchSnapshot();
  });
});

describe("release created by bot account", () => {
  beforeEach(() => {
    const localMockData = { ...githubData };
    if (localMockData.event.release) {
      localMockData.event.release.author.login = "bt-version-tagger[bot]";
    }

    mockGetInput({ ...coreData, github: JSON.stringify(localMockData) });
  });

  test("falls back to github.actor, not the bot login", () => {
    expect(useConfig().author).toBe(githubData.actor);
  });
});

describe("no release or commit", () => {
  beforeEach(() => {
    const localMockData = { ...githubData };
    delete localMockData.event.release;
    delete localMockData.event.commits;

    mockGetInput({ ...coreData, github: JSON.stringify(localMockData) });
  });

  test("should return the expected config", () => {
    expect(useConfig()).toMatchSnapshot();
  });
});

describe("push merged by a bot account", () => {
  beforeEach(() => {
    const localMockData = {
      ...githubData,
      actor: "ducktape-cd[bot]",
      event: {
        ...githubData.event,
        release: undefined,
        head_commit: { author: { username: "dhudec" } },
      },
    };

    mockGetInput({ ...coreData, github: JSON.stringify(localMockData) });
  });

  test("uses the pushed commit author, not the bot actor", () => {
    const config = useConfig();
    expect(config.author).toBe("dhudec");
    expect(config.slack_user_id).toBe("U029GBW14P3");
  });
});

describe("push by a bot account with no human author", () => {
  beforeEach(() => {
    const localMockData = {
      ...githubData,
      actor: "ducktape-cd[bot]",
      event: {
        ...githubData.event,
        release: undefined,
        head_commit: { author: { username: "ducktape-cd[bot]" } },
      },
    };

    mockGetInput({ ...coreData, github: JSON.stringify(localMockData) });
  });

  test("keeps the bot actor and resolves no slack user", () => {
    const config = useConfig();
    expect(config.author).toBe("ducktape-cd[bot]");
    expect(config.slack_user_id).toBeUndefined();
  });
});

describe("author input override", () => {
  beforeEach(() => {
    mockGetInput({ ...coreData, author: "lcschy" });
  });

  test("wins over the release author and actor", () => {
    const config = useConfig();
    expect(config.author).toBe("lcschy");
    expect(config.slack_user_id).toBe("U026LV447FG");
  });
});
