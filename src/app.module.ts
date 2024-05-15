import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import ExampleModule from './modules/example/example.module'

@Module({
	imports: [ConfigModule.forRoot(), ExampleModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
