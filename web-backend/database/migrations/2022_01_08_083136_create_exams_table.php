<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExamsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('institute_id')->nullable()->constrained('institutes')->onDelete('cascade');
            $table->foreignId('exam_category_id')->constrained('exam_categories')->onDelete('cascade');
            $table->foreignId('exam_type_id')->nullable()->constrained('exam_types')->onDelete('cascade');
            $table->string('name');
            $table->enum('type', ['live', 'standard']);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->longText('instruction');
<<<<<<< HEAD
            $table->Text('consentments');
=======
            $table->json('consentments');
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
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
        Schema::dropIfExists('exams');
    }
}
