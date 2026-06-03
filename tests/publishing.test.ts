import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
  name: string;
  version: string;
  private?: boolean;
  description?: string;
  license?: string;
  mcpName?: string;
  main?: string;
  bin?: Record<string, string>;
  files?: string[];
  repository?: { type?: string; url?: string };
};

const serverJson = JSON.parse(readFileSync("server.json", "utf8")) as {
  name: string;
  version: string;
  packages: Array<{
    registryType: string;
    identifier: string;
    version: string;
    transport: { type: string };
  }>;
};

describe("publishing metadata", () => {
  it("declares npm and MCP registry ownership metadata", () => {
    expect(packageJson.private).toBeUndefined();
    expect(packageJson.name).toBe("random-design-mcp");
    expect(packageJson.mcpName).toBe("io.github.yanislav-igonin/random-design-mcp");
    expect(packageJson.description).toContain("MCP server");
    expect(packageJson.license).toBe("MIT");
    expect(packageJson.repository).toEqual({
      type: "git",
      url: "git+https://github.com/yanislav-igonin/random-design-mcp.git",
    });
  });

  it("publishes only runtime package files", () => {
    expect(packageJson.main).toBe("dist/index.js");
    expect(packageJson.bin).toEqual({
      "random-design-mcp": "dist/index.js",
    });
    expect(packageJson.files).toEqual([
      "dist/",
      "README.md",
      "server.json",
    ]);
  });

  it("keeps server.json aligned with package.json", () => {
    expect(serverJson.name).toBe(packageJson.mcpName);
    expect(serverJson.version).toBe(packageJson.version);
    expect(serverJson.packages).toEqual([
      {
        registryType: "npm",
        identifier: packageJson.name,
        version: packageJson.version,
        transport: { type: "stdio" },
      },
    ]);
  });
});
