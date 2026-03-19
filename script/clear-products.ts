import "dotenv/config";
import { db } from "../server/db";
import { products } from "../shared/schema";

async function main() {
  console.log("Excluindo produtos antigos para resemear o banco de dados...");
  await db.delete(products);
  console.log("Produtos excluídos com sucesso. Reinicie o servidor de desenvolvimento para que as novas sementes sejam lançadas.");
  process.exit(0);
}

main().catch(e => {
  console.error("Erro ao deletar produtos", e);
  process.exit(1);
});
