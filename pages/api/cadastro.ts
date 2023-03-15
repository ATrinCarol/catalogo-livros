import type {NextApiRequest, NextApiResponse} from 'next';
import type {respostaPadraoMsg} from '../../types/respostaPadraoMsg';
import type {cadastroLivros} from '../../types/cadastroLivros'
import {livroModel} from '../../models/livroModel';
import {conexaoMongoDB} from '../../middlewares/conexaoMongoDB'

const endpointCadastro = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) =>{

    if (req.method === 'POST'){
        const livro = req.body as cadastroLivros;

        if (!livro.titulo || livro.titulo.length < 2 ){
            return res.status(400).json({ erro: "Informe um título válido!"});
        }

        if (!livro.autor || livro.autor.length < 2){
            return res.status(400).json({ erro: "Informe um nome válido!"});
        }

       if (!livro.editora || livro.editora.length < 2){
            return res.status(400).json({ erro: "Informe uma editora válida!"})
       }
       if (!livro.ano || livro.ano < 1){
            return res.status(400).json({erro: "Informe um ano válido!"})
       }

        //validar duplicidade de email
        const livrosComMesmoTitulo = await livroModel.find({ titulo : livro.titulo});
        if (livrosComMesmoTitulo && livrosComMesmoTitulo.length > 0){
            return res.status(400).json({ erro: "Livro já cadastrado. Verifique!" })
        }

        //salvar no banco de dados
        const livroQueSeraSalvo = {
            titulo: livro.titulo,
            autor: livro.autor,
            ano: livro.ano,
            editora: livro.editora
        }
        await livroModel.create(livroQueSeraSalvo);
        return res.status(200).json({ msg : 'Livro cadastrado com sucesso'});
    } 

    return res.status(405).json({ erro : 'Método informado não é válido'});
}

export default conexaoMongoDB(endpointCadastro);