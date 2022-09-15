class Options {
    constructor () {
        this.getPostgresOptions = () => {
            return {
                type: 'postgres',
                url: 'postgresql://postgres:password@localhost:5432/postgres',
                entities: [],
                synchronize: false,
            }
        };

        this.getRedisOptions = () => {
            return {
                socker: {
                    hostname: 'localhost',
                    port: 6379
                }
            }
        }

        this.getRabbitOptions = () => {
            return {
                url: 'amqp://localhost:5672/'
            }
        }
    }
    
}

module.exports.Options = Options;