//Comentar o codigo para estudar depois

const express = require('express')
const app = express()
app.use(express.json())

let filmes=[]
let proxFilme=1
let proxReview=1

//Agora fazemos as CRUDs

//Criar filmes
/*Temos o req(request), que é a requisição feita pelo cliente, temos o res(response), 
que serve para responder a requisição do cliente, criamos uma constante que pede ao
cliente o titulo, ano e genero do filme(request.body), e criamos uma variável para guardar
um novo filme(novoFilme) que vai receber um id próprio, o titulo, o ano, genero, e as reviews
depois guardamos o novoFilme dentro do array de filme que temos usando o push e por fim
damos o estado da resposta(res) para 201 e retornamos o novoFilme em formato JSON
*/ 
app.post("/filmes", (req, res) => {
    const { titulo, ano, genero } = req.body
    const novoFilme = { id: proxFilme++, titulo, ano, genero, reviews: [] }
    filmes.push(novoFilme)
    res.status(201).json(novoFilme)
})

//Ler Filmes
app.get("/filmes", (req, res) => {res.json(filmes)})

// Deletar filme
/*O Deletar filme usa a mesma lógica de req e res do Criar filme, mas agora como estamos
num array, precisamos encontrar o índice do filme a ser deletado e removê-lo, fazemos
um teste para ver se o filme que esta sendo deletado existe, se ele não existir avisamos
o usuário com um erro 404, caso ele exista fazemos um splice, que na pratica é remover
o index do filme que esta sendo removido, por fim avisamos o usuário que o filme escolhido
foi deletado */
app.delete("/filmes/:id", (req, res) => {
    const index = filmes.findIndex(i => i.id == req.params.id);
    if (index === -1) return res.status(404).send("Filme não encontrado");
    filmes.splice(index, 1);
    res.send("Filme deletado");
});             

//Editar Filme
app.put("/filmes/:id", (req, res) => {
    const filme= filmes.find(f => f.id ===parseInt(req.params.id))
    if(!filme) return res.status(404).send( "Filme não cadastrado")
    const{title, ano, genero}= req.body
    if(title) filme.title= title
    if(ano) filme.ano= ano
    if(genero) filme.genero= genero
    res.json(filme)
})

//Fazer review
app.post("/filmes/:id/reviews", (req, res) => {
    const filme = filmes.find(f => f.id == parseInt(req.params.id))
    if(!filme) return res.status(404).send("Filme não cadastrado")
    const{comentario, nota} = req.body
    if(nota<0 || nota>5) return res.status(400).send("A nota deve ser entre 0 e 5")
    const review= {id:proxReview++, nota, comentario }
    filme.reviews.push(review)
    res.status(201).json(review)
})

//Atualizar review
app.put("/filmes/:idFilme/reviews/:idReview", (req, res) => {
    const filme = filmes.find(f => f.id == parseInt(req.params.idFilme))
    if(!fillme) return res.status(404).send("Filme não cadastrado")
    const review= filme.reviews.find(r => r.id == parseInt(req.params.idReview))
    if(!review) return res.status(404).send("Review não encontrada")
    const{comentario, nota} = req.body
    if(nota!== undefined){
        if(nota<0 || nota>5) return res.status(400).send("A nota deve ser entre 0 e 5")
        review.nota= nota
    }
    if(comentario) review.comentario=comentario
    res.json(review)
})

app.delete("/filmes/:idFilme/reviews/:idReview", (req, res) => {
    const filme= filmes.find(f=> f.id == parseInt(req.params.idFilme))
    if(!filme) return res.status(404).send("Filme não cadastrado")
    const reviewIndex= filme.reviews.findIndex(r => r.id == parseInt(req.params.idReview))
    if(reviewIndex === -1) return res.status(404).send("Review não encontrada")
    filme.reviews.splice(reviewIndex, 1)
    res.send("Review deletada")
})



app.listen(3000, () => console.log("API rodando na porta 3000"));