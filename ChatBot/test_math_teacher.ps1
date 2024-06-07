# Fonction pour vérifier si le port est utilisé
function Test-Port {
    param (
        [int]$port
    )
    $tcp = [System.Net.Sockets.TcpListener]::New([System.Net.IPAddress]::Loopback, $port)
    try {
        $tcp.Start()
        $true
    } catch {
        $false
    } finally {
        $tcp.Stop()
    }
}

# Vérifier si le serveur Ollama est déjà en cours d'exécution
if (-Not (Test-Port -port 11434)) {
    Write-Output "Le port 11434 est déjà utilisé. Arrêt du processus existant."
    Stop-Process -Name "ollama"
}

# Démarrer le serveur Ollama
Start-Process -NoNewWindow -FilePath "ollama.exe" -ArgumentList "serve"

# Pause pour s'assurer que le serveur démarre correctement
Start-Sleep -Seconds 10

# Exécuter une question de test
$response = ollama run math-teacher "Qui a gagné la coupe de monde de foot en 2008"
Write-Output $response

# Arrêter le serveur Ollama
Stop-Process -Name "ollama"