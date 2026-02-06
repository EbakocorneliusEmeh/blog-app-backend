import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from '../tenants/tenant.schema';
import { PostModule } from '../post/post.module';
import { PublicController } from './public.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
    PostModule, // Reuse your existing post service
  ],
  controllers: [PublicController],
})
export class PublicModule {}
