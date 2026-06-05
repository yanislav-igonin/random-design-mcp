import { readFileSync } from "node:fs";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { describe, expect, it } from "vitest";
import {
  createServer,
  generateDesignDescriptionInputSchema,
  getVersion,
  handleGenerateDesignDescription,
} from "../src/tool.js";

const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
  version: string;
};

describe("generate_design_description tool", () => {
  it("accepts only documented optional arguments", () => {
    expect(generateDesignDescriptionInputSchema.parse({})).toEqual({});
    expect(
      generateDesignDescriptionInputSchema.parse({
        productType: "Landing page",
        audience: "Developers",
        priority: "Conversion",
        compatibility: false,
      }),
    ).toEqual({
      productType: "Landing page",
      audience: "Developers",
      priority: "Conversion",
      compatibility: false,
    });
    expect(() =>
      generateDesignDescriptionInputSchema.parse({ seed: 42 }),
    ).toThrow();
  });

  it("returns one Markdown text content item", () => {
    const result = handleGenerateDesignDescription(
      { productType: "Landing page" },
      () => "# Design Direction",
    );
    expect(result).toEqual({
      content: [{ type: "text", text: "# Design Direction" }],
    });
  });

  it("returns readable tool error text without throwing", () => {
    const result = handleGenerateDesignDescription({}, () => {
      throw new Error("Catalog era must contain at least 40 items");
    });
    expect(result).toEqual({
      content: [{
        type: "text",
        text: "Failed to generate design description: Catalog era must contain at least 40 items",
      }],
      isError: true,
    });
  });

  it("rejects undocumented arguments at the registered MCP boundary", async () => {
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: "tool-test", version: "0.1.0" });
    const server = createServer();
    await server.connect(serverTransport);
    await client.connect(clientTransport);

    try {
      const { tools } = await client.listTools();
      const designTool = tools.find((tool) =>
        tool.name === "generate_design_description"
      );
      expect(designTool?.inputSchema).toMatchObject({
        additionalProperties: false,
      });

      const result = await client.callTool({
        name: "generate_design_description",
        arguments: { seed: 42 },
      });
      expect(result.isError).toBe(true);
    } finally {
      await client.close();
      await server.close();
    }
  });
});

describe("get_version tool", () => {
  it("returns the package.json version as text", () => {
    expect(getVersion()).toBe(packageJson.version);
  });

  it("is registered at the MCP boundary with no arguments", async () => {
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: "tool-test", version: "0.1.0" });
    const server = createServer();
    await server.connect(serverTransport);
    await client.connect(clientTransport);

    try {
      const { tools } = await client.listTools();
      expect(tools.map((tool) => tool.name)).toEqual([
        "generate_design_description",
        "get_version",
      ]);

      const result = await client.callTool({
        name: "get_version",
        arguments: {},
      });
      expect(result).toEqual({
        content: [{ type: "text", text: packageJson.version }],
      });
    } finally {
      await client.close();
      await server.close();
    }
  });
});
