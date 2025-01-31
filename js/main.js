setInterval(() => {
    fetch("https://site-ampharos.onrender.com/ping", { method: "GET", cache: "no-store" })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        console.log("Ping enviado com sucesso!");
      })
      .catch(error => console.error("Erro ao enviar ping:", error));
}, 600000); // 10 minutos
