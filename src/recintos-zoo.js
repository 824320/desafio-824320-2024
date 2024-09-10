export { RecintosZoo as RecintosZoo };

class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: "savana", tamanho: 10, animais: [{ especie: "MACACO", quantidade: 3 }] },
            { numero: 2, bioma: "floresta", tamanho: 5, animais: [] },
            { numero: 3, bioma: "savana e rio", tamanho: 7, animais: [{ especie: "GAZELA", quantidade: 1 }] },
            { numero: 4, bioma: "rio", tamanho: 8, animais: [] },
            { numero: 5, bioma: "savana", tamanho: 9, animais: [{ especie: "LEAO", quantidade: 1 }] }
        ];

        this.animais = {
            "LEAO": { tamanho: 3, bioma: ["savana"], carnivoro: true },
            "LEOPARDO": { tamanho: 2, bioma: ["savana"], carnivoro: true },
            "CROCODILO": { tamanho: 3, bioma: ["rio"], carnivoro: true },
            "MACACO": { tamanho: 1, bioma: ["savana", "floresta"], carnivoro: false },
            "GAZELA": { tamanho: 2, bioma: ["savana"], carnivoro: false },
            "HIPOPOTAMO": { tamanho: 4, bioma: ["savana", "rio"], carnivoro: false }
        };
    }

    analisaRecintos(especie, quantidade) {
        // Verifica se o animal existe no zoológico
        if (!this.animais[especie]) {
            return { erro: "Animal inválido" };
        }

        // Verifica se a quantidade de animais é válida
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const animal = this.animais[especie];
        const espacoNecessario = quantidade * animal.tamanho;
        const recintosViaveis = [];

        // Percorre cada recinto para verificar se é adequado
        for (let i = 0; i < this.recintos.length; i++) {
            const recinto = this.recintos[i];
            let biomaAdequado = false;
            for (let j = 0; j < animal.bioma.length; j++) {
                if (recinto.bioma.includes(animal.bioma[j])) {
                    biomaAdequado = true;
                    break;
                }
            }
            if (!biomaAdequado) continue;

            let recintoTemCarnivoro = false;
            for (let j = 0; j < recinto.animais.length; j++) {
                if (this.animais[recinto.animais[j].especie].carnivoro) {
                    recintoTemCarnivoro = true;
                    break;
                }
            }
            if (recintoTemCarnivoro && !animal.carnivoro) continue;

            if (animal.carnivoro) {
                let recintoComHerbivoro = false;
                for (let j = 0; j < recinto.animais.length; j++) {
                    if (!this.animais[recinto.animais[j].especie].carnivoro) {
                        recintoComHerbivoro = true;
                        break;
                    }
                }
                if (recintoComHerbivoro) continue;
            }

            let espacoOcupado = 0;
            let especiesDiferentes = false;

            for (let j = 0; j < recinto.animais.length; j++) {
                const a = recinto.animais[j];
                const animalNoRecinto = this.animais[a.especie];
                if (a.especie === "HIPOPOTAMO" && recinto.bioma !== "savana e rio" && especie !== "HIPOPOTAMO") continue;
                espacoOcupado += animalNoRecinto.tamanho * a.quantidade;
                if (animalNoRecinto !== animal) especiesDiferentes = true;
            }

            if (especiesDiferentes) espacoOcupado += 1;
            const espacoDisponivel = recinto.tamanho - espacoOcupado;

            if (espacoDisponivel >= espacoNecessario) {
                recintosViaveis.push({
                    recinto: recinto.numero,
                    espacoLivre: espacoDisponivel - espacoNecessario,
                    total: recinto.tamanho
                });
            }
        }

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        // Ordena os recintos viáveis manualmente
        const recintosOrdenados = [];
        while (recintosViaveis.length > 0) {
            let maxEspacoLivre = -Infinity;
            let melhorRecinto = null;
            let indiceMelhorRecinto = -1;

            for (let i = 0; i < recintosViaveis.length; i++) {
                const recinto = recintosViaveis[i];
                if (recinto.espacoLivre > maxEspacoLivre ||
                    (recinto.espacoLivre === maxEspacoLivre && recinto.recinto < melhorRecinto.recinto)) {
                    maxEspacoLivre = recinto.espacoLivre;
                    melhorRecinto = recinto;
                    indiceMelhorRecinto = i;
                }
            }

            recintosViaveis.splice(indiceMelhorRecinto, 1);
            recintosOrdenados.push(melhorRecinto);
        }

        const resultadoFormatado = recintosOrdenados.map(r => `Recinto ${r.recinto} (espaço livre: ${r.espacoLivre} total: ${r.total})`);

        return { recintosViaveis: resultadoFormatado };
    }
}
