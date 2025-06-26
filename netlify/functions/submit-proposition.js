const { Octokit } = require("@octokit/rest");

const GITHUB_TOKEN = process.env.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;
const FILE_PATH = "propositions.json";
const REPO_OWNER = "votre-nom-utilisateur";
const REPO_NAME = "projet-ITE-V2.0"; // ou autre nom

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Méthode non autorisée",
    };
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN });
  const body = JSON.parse(event.body);

  try {
    // Lire le contenu actuel
    const { data: fileData } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: FILE_PATH,
    });

    const content = Buffer.from(fileData.content, "base64").toString("utf-8");
    const currentData = JSON.parse(content);
    currentData.push(body); // ajouter la nouvelle proposition

    const updatedContent = Buffer.from(JSON.stringify(currentData, null, 2)).toString("base64");

    // Mettre à jour le fichier sur GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: FILE_PATH,
      message: `💡 Nouvelle proposition ajoutée`,
      content: updatedContent,
      sha: fileData.sha,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("Erreur :", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Impossible d'enregistrer la proposition" }),
    };
  }
};

