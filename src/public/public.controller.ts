import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { Tenant } from '../tenant/tenant.schema';
import { Tenant } from '../tenants/tenant.schema';

import { PostService } from '../post/post.service';

@Controller('public')
export class PublicController {
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<Tenant>,
    private postService: PostService,
  ) {}

  @Get('blog/:slug')
  async getBlog(@Param('slug') slug: string) {
    const tenant = await this.tenantModel.findOne({ slug }).lean();
    if (!tenant) throw new NotFoundException('Blog not found');
    return tenant;
  }

  @Get('blog/:slug/posts')
  async getPosts(@Param('slug') slug: string) {
    const tenant = await this.tenantModel.findOne({ slug });
    if (!tenant) throw new NotFoundException('Blog not found');
    return this.postService.findPublishedByTenant(tenant._id.toString());
  }

  @Get('blog/:slug/posts/:postSlug')
  async getPost(
    @Param('slug') slug: string,
    @Param('postSlug') postSlug: string,
  ) {
    const tenant = await this.tenantModel.findOne({ slug });
    if (!tenant) throw new NotFoundException('Blog not found');

    const post = await this.postService.findBySlugAndTenant(
      postSlug,
      tenant._id.toString()
    );

    if (!post) throw new NotFoundException('Post not found');
    return post;
  }
}
