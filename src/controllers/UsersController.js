const { hash, compare } = require('bcryptjs');
const AppError = require('../utils/AppError');
const sqliteConnection = require('../database/sqlite');

class UsersController {

    async create(request, response) {
        const { name, email, password } = request.body;        
        
        const database = await sqliteConnection();
        const checkUserExists = await database.get(
            "SELECT * FROM users WHERE email = (?)",   //associa cada interrogação com o item do vetor
            [email]                                    //passado como parâmetro, conforme sua posição
        );

        if (checkUserExists) {
            throw new AppError("Este e-mail já está cadastrado.");
        }

        const hashedPassword = await hash(password.toString(), 8);

        await database.run(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );

        return response.status(201).json();
    }

    async update(request, response) {
        const { name, email, password, old_password } = request.body;
        const { id } = request.params;
        const database = await sqliteConnection();
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

        // caso o usuário pesquisado pelo ID retorne NULL, lança erro de usuário inexistente no DB
        if (!user) {
            throw new AppError("Usuário não encontrado.");            
        }
        
        // valida se o e-mail a ser alterado já não existe no DB associado a outro usuário
        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
            throw new AppError("Este e-mail já está em uso.");
        }

        // checa se o usuário digitou a nova senha MAS não digitou a senha antiga
        if ((password && !old_password) || (!password && old_password)) {
            throw new AppError("Você precisa digitar a senha antiga e a nova senha para que ela seja atualizada.")
        }

        // compara se a senha antiga informada no request é igual à senha atual do DB ou se não
        // é igual à senha já cadastrada
        if (password & old_password) {
            const checkOldPassword = await compare(old_password.toString(), user.password);
            const checkSamePasswords = await compare(password.toString(), user.password);

            if (!checkOldPassword) {
                throw new AppError("A senha antiga não confere.");
            }
            if (checkSamePasswords) {
                throw new AppError("A senha nova e a senha atual são iguais.");
            }

            // se tiver passado por ambas as validações, a senha é atualizda no DB
            user.password = await hash(password.toString(), 8); 
        }
        
        // Nulish operator - caso não venha nome/e-mail na requisição (null), mantém os dados já existentes do DB
        user.name = name ?? user.name;
        user.email = email ?? user.email;
        
        await database.run(
            "UPDATE users SET name = ?, email = ?, password = ?, updated_at = DATETIME('now') WHERE id = ?",
            [user.name, user.email, user.password, id]
        )

        return response.json();
    }
}

module.exports = UsersController;