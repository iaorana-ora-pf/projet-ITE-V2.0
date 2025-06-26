const { Octokit } = require("@octokit/core");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Méthode non autorisée" };
  }

  const token = process.env.GITHUB_TOKEN; // remplace ici
  const repo = "projet-ITE-V2.0"; // ex: "projet-ITE"
  const owner = "iaorana-ora-pf"; // ex: "tupseudo"
  const path = "propositions.json"; // chemin du fichier dans ton repo

  const octokit = new Octokit({ auth: token });

  try {
    const data = JSON.parse(event.body);

    // 1. Récupère le fichier existant
    const { data: file } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path
    });

    const existingContent = Buffer.from(file.content, 'base64').toString('utf-8');
    const json = existingContent ? JSON.parse(existingContent) : [];

    // 2. Ajoute la nouvelle proposition
    json.push(data);

    // 3. Envoie la version modifiée
    const updatedContent = Buffer.from(JSON.stringify(json, null, 2)).toString('base64');

    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path,
      message: `Ajout d'une proposition via le formulaire`,
      content: updatedContent,
      sha: file.sha
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Proposition ajoutée avec succès" })
    };
  } catch (err) {
    console.error("Erreur :", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur lors de l’envoi" })
    };
  }
};
