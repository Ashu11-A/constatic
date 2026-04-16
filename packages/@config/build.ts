import { type BuildConfig } from "bun";
import { generateDtsBundle } from 'dts-bundle-generator';
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { styleText } from "node:util";

interface BuildOptions {
    disableTypes?: boolean;
    outdir?: string
}

async function generateTypes(sourceFilePath: string, outputDirectory: string): Promise<void> {
  const declarationPath = join(outputDirectory, 'index.d.ts')
  const declarationCodeArray = generateDtsBundle([{
    filePath: sourceFilePath,
    output: {
      sortNodes: true,
      exportReferencedTypes: false,
      inlineDeclareExternals: true,
      inlineDeclareGlobals: true
    }
  }])

  await mkdir(dirname(declarationPath), { recursive: true })
  await writeFile(declarationPath, declarationCodeArray.join('\n'), { encoding: 'utf-8' })
}

export async function build(options: BuildOptions = {}) {
    const preset = {
        entrypoints: ['src/index.ts'],
        // root: "./src",
        outdir: 'dist/esm/',
        target: "node",
        minify: true,
        sourcemap: 'linked',
        external: ['reminist', 'tinyglobby', 'url-ast', 'discord.js']
    } satisfies BuildConfig;

    const result = await Bun.build({ ...preset, format: "esm" });
    
    console.log(result.outputs
        .map(({ path }) => {
            const filepath = styleText(["yellowBright"],
                path.replace(process.cwd(), "")
            )

            return `${styleText("green", "ESM")} ${filepath}`
        })
        .join("\n")
    )
    console.log();
    console.log(styleText("green", "✔ The project was compiled successfully!"))

    if (!(options.disableTypes??false)){
        await generateTypes('src/index.ts', 'dist/types')
        console.log(styleText("blue", "✔ DTS generated successfully!"));
    }
}