<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePracticesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('practices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('institute_id')->nullable()->constrained('institutes')->onDelete('cascade');
            $table->foreignId('exam_category_id')->constrained('exam_categories')->onDelete('cascade');
            $table->foreignId('exam_type_id')->nullable()->constrained('exam_types')->onDelete('cascade');
            $table->string('name');
            $table->enum('status', ['published', 'draft'])->default('draft');
            $table->date('start_date')->nullable();
            $table->time('start_time')->nullable();
            $table->longText('instruction');
            $table->json('consentments');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('practices');
    }
}
