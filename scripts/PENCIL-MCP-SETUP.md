# Configuração do Pencil MCP com AppImage

## Problema

O Pencil AppImage monta em um diretório temporário dinâmico (`/tmp/.mount_Pencil*`) cada vez que é executado, tornando o caminho do servidor MCP imprevisível.

## Solução

Um script wrapper que encontra dinamicamente o ponto de montagem atual do AppImage.

## Instalação

### 1. Copie o script para sua pasta pessoal

```bash
mkdir -p ~/.pencil-mcp
cp scripts/pencil-mcp-wrapper.sh ~/.pencil-mcp/
chmod +x ~/.pencil-mcp/pencil-mcp-wrapper.sh
```

### 2. Atualize o opencode.json

Adicione ou atualize a configuração do MCP pencil:

```json
{
  "mcp": {
    "pencil": {
      "command": ["bash", "-c", "$HOME/.pencil-mcp/pencil-mcp-wrapper.sh"],
      "enabled": true,
      "type": "local"
    }
  }
}
```

## Uso

1. Inicie o Pencil AppImage primeiro
2. Inicie o OpenCode
3. O MCP pencil funcionará automaticamente

## Notas

- O wrapper usa `mount | grep` para encontrar o diretório de montagem atual
- Se o Pencil for atualizado e o caminho interno do binário mudar, edite apenas o script `pencil-mcp-wrapper.sh`
- O `opencode.json` **não precisa** ser alterado após a configuração inicial
